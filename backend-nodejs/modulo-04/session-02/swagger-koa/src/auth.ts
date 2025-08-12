import { Context, Next } from 'koa';

export async function authBearer(ctx: Context, next: Next) {
    // comentario: validación simple por header Authorization
    const auth = ctx.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = { statusCode: 401, error: 'Unauthorized', message: 'Missing bearer token' };
        return;
    }
    const token = auth.substring('Bearer '.length).trim();
    if (token !== 'testtoken') {
        ctx.status = 401;
        ctx.body = { statusCode: 401, error: 'Unauthorized', message: 'Invalid token' };
        return;
    }
    await next();
}
