import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { authorize } from './middleware/authorize';

const app = new Koa();
const router = new Router();

// Simula autenticación
app.use(async (ctx, next) => {
	ctx.state.user = {
		id: 1,
		role: 'supervisor',
		permissions: ['view_reports']
	};
	await next();
});

router.get('/profile', (ctx) => {
	ctx.body = { message: 'Perfil público', user: ctx.state.user };
});

router.get('/admin/users', authorize(['admin']), (ctx) => {
	ctx.body = { message: 'Solo para admins' };
});

router.get('/reports', authorize(['admin', 'supervisor']), (ctx) => {
	ctx.body = { message: 'Vista de reportes' };
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3002, () => console.log('Koa server http://localhost:3002'));