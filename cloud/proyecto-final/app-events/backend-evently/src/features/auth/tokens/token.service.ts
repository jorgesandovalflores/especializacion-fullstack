import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";
import { JwtPayload } from "src/core/http/types/jwt-payload.type";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    async signPair(user: { id: string; email: string; role: string }) {
        const accessJti = uuid();
        const refreshJti = uuid();

        const access_token = await this.jwt.signAsync(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
                jti: accessJti,
            } as JwtPayload,
            {
                secret: this.config.get<string>("JWT_ACCESS_SECRET"),
                expiresIn: this.config.get<string>("JWT_ACCESS_TTL"),
            },
        );

        const refresh_token = await this.jwt.signAsync(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
                jti: refreshJti,
            } as JwtPayload,
            {
                secret: this.config.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: this.config.get<string>("JWT_REFRESH_TTL"),
            },
        );

        return { access_token, refresh_token };
    }
}
