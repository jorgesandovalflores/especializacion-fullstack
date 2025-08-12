import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class DummyJwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // comentario: validación simple por header Authorization
        const req = context.switchToHttp().getRequest();
        const auth = req.headers['authorization'] as string | undefined;
        if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');
        const token = auth.substring('Bearer '.length).trim();
        if (token !== 'testtoken') throw new UnauthorizedException('Invalid token');
        return true;
    }
}
