import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

import { CacheService } from "src/core/cache/cache.service";
import { AddressEntity } from "./entities/address.entity";
import { AddressController } from "./controllers/address.controller";
import { AddressService } from "./services/address.service";
import { AddressDao } from "./dao/address.dao";
import { GoogleRemote } from "./remote/google.remote";
import { NominatimRemote } from "./remote/nominatim.remote";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        TypeOrmModule.forFeature([AddressEntity]),
        ConfigModule,
        JwtModule.register({}),
        HttpModule,
    ],
    controllers: [AddressController],
    providers: [
        AddressService,
        AddressDao,
        CacheService,
        GoogleRemote,
        NominatimRemote,
    ],
    exports: [AddressService, AddressDao],
})
export class AddressModule {}
