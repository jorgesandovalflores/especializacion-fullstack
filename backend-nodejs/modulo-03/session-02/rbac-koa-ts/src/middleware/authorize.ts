import { Middleware } from 'koa';

export const authorize = (roles: string[]): Middleware => {
	return async (ctx, next) => {
		const user = ctx.state.user;
		if (!user || !roles.includes(user.role)) {
			ctx.status = 403;
			ctx.body = { message: 'Access denied' };
			return;
		}
		await next();
	};
};