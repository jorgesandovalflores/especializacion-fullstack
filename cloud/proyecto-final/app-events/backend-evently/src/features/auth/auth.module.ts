import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TokenService } from "./tokens/token.service";
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { UsersModule } from "src/features/users/users.module";
import { RedisModule } from "src/core/cache/redis.module";

@Module({
    imports: [UsersModule, RedisModule, PassportModule, JwtModule.register({})],
    providers: [
        AuthService,
        TokenService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
