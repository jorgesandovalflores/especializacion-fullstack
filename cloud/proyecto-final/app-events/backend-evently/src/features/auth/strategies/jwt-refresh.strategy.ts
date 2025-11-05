import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "src/core/cache/redis.service";
import { JwtPayload } from "src/core/http/types/jwt-payload.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    "jwt-refresh",
) {
    constructor(
        config: ConfigService,
        private readonly redis: RedisService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>("JWT_REFRESH_SECRET"),
        });
    }
    async validate(payload: JwtPayload) {
        const client = this.redis.getClient();
        const blocked = await client.get(`rt:blacklist:${payload.jti}`);
        if (blocked) throw new UnauthorizedException("Refresh token revoked");
        return payload;
    }
}
