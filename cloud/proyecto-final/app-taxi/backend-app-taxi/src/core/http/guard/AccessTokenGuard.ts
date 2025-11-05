import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

/**
 * Guard que valida el access_token (JWT de acceso).
 * - Lee el header Authorization: Bearer <token>
 * - Verifica firma y expiración usando JWT_ACCESS_SECRET
 * - Inyecta el payload en request.user
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException(
                "Missing or invalid Authorization header",
            );
        }

        const token = authHeader.split(" ")[1];
        try {
            const secret = this.config.get<string>("JWT_ACCESS_SECRET");
            const payload = await this.jwt.verifyAsync(token, { secret });

            // opcional: validar tipo de usuario
            if (!payload?.sub || !payload?.typ) {
                throw new UnauthorizedException("Invalid token payload");
            }

            request.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException("Invalid or expired access token");
        }
    }
}
