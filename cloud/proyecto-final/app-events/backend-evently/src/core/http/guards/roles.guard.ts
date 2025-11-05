import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(), ctx.getClass(),
        ]);
        if (!required?.length) return true;
        const req = ctx.switchToHttp().getRequest();
        const user = req.user as { role?: Role };
        if (!user || !user.role || !required.includes(user.role)) {
            throw new ForbiddenException('Insufficient role');
        }
        return true;
    }
}