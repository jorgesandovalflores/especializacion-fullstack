import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "src/core/http/types/jwt-payload.type";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    "jwt-access",
) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>("JWT_ACCESS_SECRET"),
        });
    }
    validate(payload: JwtPayload) {
        return payload;
    }
}
