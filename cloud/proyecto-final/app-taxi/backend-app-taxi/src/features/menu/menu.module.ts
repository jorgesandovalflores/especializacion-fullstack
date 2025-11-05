import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

import { CacheService } from "src/core/cache/cache.service";
import { MenuEntity } from "./entities/menu.entity";
import { MenuController } from "./controllers/menu.controller";
import { MenuService } from "./services/menu.service";
import { MenuDao } from "./dao/menu.dao";

/* -------------------------------------------------------
   PassengerModule
   - Importa TypeORM (entidad), Jwt y Config
   - Expone controller + service + dao
   - JwtModule: la firma usa secretos/TTLs desde ConfigService
     (el service pasa secret/expiresIn explícitamente)
-------------------------------------------------------- */
@Module({
    imports: [
        TypeOrmModule.forFeature([MenuEntity]),
        ConfigModule,
        JwtModule.register({}),
    ],
    controllers: [MenuController],
    providers: [MenuService, MenuDao, CacheService],
    exports: [MenuService, MenuDao],
})
export class MenuModule {}
