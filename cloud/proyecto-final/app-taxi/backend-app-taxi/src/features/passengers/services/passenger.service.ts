import { Injectable, UnauthorizedException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { CacheService } from "src/core/cache/cache.service";
import { HttpCustomException } from "src/core/http/exception/http.exception";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PassengerDao } from "../dao/passenger.dao";
import { PassengerSignUpRequest } from "../dto/passenger-signup.request";
import { PassengerLoginResponseDto } from "../dto/passenger-login-response.dto";
import { toPassengerDto } from "../mapper/passenger.mapper";

@Injectable()
export class PassengerService {
    constructor(
        private readonly passengerDao: PassengerDao,
        protected readonly i18n: I18nService,
        protected readonly cache: CacheService,
        private readonly config: ConfigService,
        private readonly jwt: JwtService,
    ) {}

    /**
     * Actualiza el perfil y re-emite access/refresh tokens.
     * - Requiere typ === "passenger".
     * - El DTO ya valida/trimmea campos; aquí solo verificamos unicidad de email si cambió.
     * - Después de actualizar, toca lastLoginAt y genera nuevos JWTs.
     * - Invalida caches relacionadas.
     */
    async updateMyProfile(
        auth: { sub: string; typ: string; id: string },
        data: PassengerSignUpRequest,
        lang?: string,
    ): Promise<PassengerLoginResponseDto> {
        // 1) Validar payload del token
        if (!auth || auth.typ !== "passenger" || !auth.id) {
            throw new UnauthorizedException("Invalid token payload");
        }

        // 2) Obtener pasajero
        const me = await this.passengerDao.findById(auth.id);
        if (!me) {
            throw new HttpCustomException(
                await this.i18n.t("auth.passenger.notExists", { lang }),
                422,
            );
        }

        // 3) Unicidad de email si cambió
        const emailChanged = data.email && data.email !== me.email;
        if (emailChanged) {
            const taken = await this.passengerDao.isEmailTakenByAnother(
                me.id,
                data.email,
            );
            if (taken) {
                throw new HttpCustomException(
                    await this.i18n.t("passenger.validation.emailAlreadyUsed", {
                        lang,
                    }),
                    422,
                );
            }
        }

        // 4) Actualizar info básica y recargar entidad
        const updated = await this.passengerDao.updateBasicInfoAndReturn(
            me.id,
            data.givenName,
            data.familyName,
            data.email,
            data.photoUrl ?? null,
        );

        if (!updated) {
            throw new HttpCustomException(
                await this.i18n.t("passenger.update.failed", { lang }),
                422,
            );
        }

        // 5) Tocar lastLoginAt (registro de nueva sesión)
        await this.passengerDao.touchLastLoginAtById(updated.id);

        // 6) Re-emitir JWTs (igual patrón que verifyOtpByPhone)
        const accessTtlSec = Number(this.config.get("JWT_ACCESS_TTL_SEC"));
        const refreshTtlSec = Number(this.config.get("JWT_REFRESH_TTL_SEC"));
        const accessSecret = this.config.get<string>("JWT_ACCESS_SECRET");
        const refreshSecret = this.config.get<string>("JWT_REFRESH_SECRET");

        const basePayload = {
            sub: updated.id,
            typ: "passenger",
            id: updated.id,
        };

        const accessToken = await this.jwt.signAsync(basePayload, {
            secret: accessSecret,
            expiresIn: accessTtlSec,
        });

        const refreshToken = await this.jwt.signAsync(
            { ...basePayload, rt: true },
            {
                secret: refreshSecret,
                expiresIn: refreshTtlSec,
            },
        );

        // 7) Invalidar cache relacionada al perfil/email
        try {
            await this.cache.del(`profile:passenger:${updated.id}`);
            await this.cache.del(`passenger:id:${updated.id}`);
            if (emailChanged && data.email) {
                await this.cache.del(`passenger:email:${data.email}`);
                if (me.email)
                    await this.cache.del(`passenger:email:${me.email}`);
            }
        } catch {}

        // 8) Responder DTO homogéneo
        return {
            accessToken,
            refreshToken,
            user: toPassengerDto(updated),
        };
    }
}
