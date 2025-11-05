import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { TokenService } from "./tokens/token.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { UsersService } from "src/features/users/users.service";
import { RedisService } from "src/core/cache/redis.service";
import { JwtPayload } from "src/core/http/types/jwt-payload.type";

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly tokens: TokenService,
        private readonly redis: RedisService,
    ) {}

    async register(dto: RegisterDto) {
        const exists = await this.users.findByEmail(dto.email);
        if (exists) throw new BadRequestException("Email already registered");
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.users.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
        const pair = await this.tokens.signPair({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            ...pair,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.users.findByEmailWithPassword(dto.email);
        if (!user) throw new UnauthorizedException("Invalid credentials");
        const ok = await argon2.verify(user.passwordHash, dto.password);
        if (!ok) throw new UnauthorizedException("Invalid credentials");
        const pair = await this.tokens.signPair({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            ...pair,
        };
    }

    async refresh(current: JwtPayload) {
        const client = this.redis.getClient();
        const ttlSec = this.parseTtlToSeconds(
            this.config.get<string>("JWT_REFRESH_TTL") ?? "7d",
        );
        // Revocar el refresh actual
        await client.setex(`rt:blacklist:${current.jti}`, ttlSec, "1");
        // Emitir nuevo par
        const pair = await this.tokens.signPair({
            id: current.sub,
            email: current.email,
            role: current.role,
        });
        return { ...pair };
    }

    async logout(current: JwtPayload) {
        const client = this.redis.getClient();
        const ttlSec = this.parseTtlToSeconds(
            this.config.get<string>("JWT_REFRESH_TTL") ?? "7d",
        );
        await client.setex(`rt:blacklist:${current.jti}`, ttlSec, "1");
        return { revoked: true };
    }

    private parseTtlToSeconds(ttl: string): number {
        // Soporta 900s, 15m, 12h, 7d
        const m = ttl.match(/^(\d+)([smhd])$/);
        if (!m) return 7 * 24 * 3600;
        const val = parseInt(m[1], 10);
        return m[2] === "s"
            ? val
            : m[2] === "m"
              ? val * 60
              : m[2] === "h"
                ? val * 3600
                : val * 86400;
    }
}
