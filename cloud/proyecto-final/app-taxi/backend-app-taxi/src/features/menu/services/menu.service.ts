import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { ConfigService } from "@nestjs/config";

import { CacheService } from "src/core/cache/cache.service";
import { MenuDao } from "../dao/menu.dao";
import { MenuApplication } from "../enum/menu-application.enum";
import { MenuDto } from "../dto/menu.dto";
import { toMenuDto } from "../mapper/menu.mapper";

@Injectable()
export class MenuService {
    constructor(
        private readonly menuDao: MenuDao,
        private readonly cache: CacheService,
        private readonly config: ConfigService,
        private readonly i18n: I18nService,
    ) {}

    // -----------------------------------------------
    // Helpers
    // -----------------------------------------------
    /** Clave de caché por aplicación. */
    private key(application: MenuApplication): string {
        return `menu:${application}:active`;
    }

    /** TTL de caché (segundos). Configurable por env MENU_CACHE_TTL_SEC, default 60s. */
    private ttl(): number {
        const v = Number(this.config.get("MENU_CACHE_TTL_SEC"));
        return Number.isFinite(v) && v > 0 ? v : 60;
    }

    // -----------------------------------------------
    // Query principal
    // -----------------------------------------------
    /**
     * Lista menús activos por aplicación (orden ascendente por `order`) con caché volátil.
     * - Intenta leer de caché primero.
     * - Si no hay caché, consulta DAO, mapea a DTO y guarda en caché.
     */
    async getActiveMenusByApplication(
        application: MenuApplication,
        _lang?: string, // reservado para mensajes i18n si necesitas errores a futuro
    ): Promise<MenuDto[]> {
        const cacheKey = this.key(application);

        // 1) Cache hit
        const cached = await this.cache.get<MenuDto[]>(cacheKey);
        if (cached && Array.isArray(cached)) {
            return cached;
        }

        // 2) DAO
        const entities =
            await this.menuDao.findActiveByApplication(application);
        const dtos = entities.map(toMenuDto);

        // 3) Guardar en caché
        await this.cache.set(cacheKey, dtos, this.ttl());

        return dtos;
    }

    // -----------------------------------------------
    // Invalidaciones (para usar desde comandos de escritura)
    // -----------------------------------------------
    /** Invalidar caché de una aplicación específica. Útil tras crear/editar/eliminar menús. */
    async invalidateByApplication(application: MenuApplication): Promise<void> {
        await this.cache.del(this.key(application));
    }

    /** Invalidar caché de todas las aplicaciones conocidas. Llama a este método si no sabes cuál cambió. */
    async invalidateAll(): Promise<void> {
        // Si tienes un listado de apps en enum, podrías iterarlo.
        const apps = Object.values(MenuApplication) as MenuApplication[];
        await Promise.all(apps.map((a) => this.cache.del(this.key(a))));
    }
}
