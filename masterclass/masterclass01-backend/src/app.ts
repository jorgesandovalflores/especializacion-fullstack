import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

// Middleware
app.use(bodyParser());

// Rutas
router.get('/', (ctx) => {
    ctx.body = '¡Hola, mundo con TypeScript!';
});

app.use(router.routes()).use(router.allowedMethods());

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
