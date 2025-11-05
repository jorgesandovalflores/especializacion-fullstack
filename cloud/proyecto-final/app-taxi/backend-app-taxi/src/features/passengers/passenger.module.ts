import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

import { PassengerEntity } from "./entities/passenger.entity";
import { PassengerDao } from "./dao/passenger.dao";
import { PassengerService } from "./services/passenger.service";
import { PassengerController } from "./controllers/passenger.controller";
import { CacheService } from "src/core/cache/cache.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { PassengerOtpDao } from "./dao/passenger-otp.dao";
import { PassengerOtpEntity } from "./entities/passenger-otp.entity";

/* -------------------------------------------------------
   PassengerModule
   - Importa TypeORM (entidad), Jwt y Config
   - Expone controller + service + dao
   - JwtModule: la firma usa secretos/TTLs desde ConfigService
     (el service pasa secret/expiresIn explícitamente)
-------------------------------------------------------- */
@Module({
    imports: [
        TypeOrmModule.forFeature([PassengerEntity, PassengerOtpEntity]),
        ConfigModule,
        JwtModule.register({}),
    ],
    controllers: [PassengerController, AuthController],
    providers: [
        PassengerService,
        AuthService,
        PassengerDao,
        PassengerOtpDao,
        CacheService,
    ],
    exports: [PassengerService, AuthService, PassengerDao, PassengerOtpDao],
})
export class PassengerModule {}
