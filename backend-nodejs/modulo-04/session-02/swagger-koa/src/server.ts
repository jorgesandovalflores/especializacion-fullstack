import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';
import booksRoutes from './routes/books.routes';
import { authBearer } from './auth';
import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

const app = new Koa();
const api = new Router({ prefix: '/api' });

// comentario: body parser para JSON
app.use(bodyParser());

// comentario: rutas públicas
api.use(booksRoutes.routes(), booksRoutes.allowedMethods());

// comentario: proteger SOLO el endpoint /books/admin con authBearer
// Nota: como admin es GET /api/books/admin en el router, aplicamos un middleware condicional:
app.use(async (ctx, next) => {
    if (ctx.path === '/api/books/admin') {
        return authBearer(ctx, next);
    }
    return next();
});

app.use(api.routes()).use(api.allowedMethods());

// ----- Swagger (OpenAPI 3) -----
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Books API (Koa)',
        version: '1.0.0',
        description: 'CRUD with mock data and Swagger (Koa)',
    },
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            Book: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '1' },
                    title: { type: 'string', example: 'Clean Architecture' },
                    author: { type: 'string', example: 'Robert C. Martin' },
                    year: { type: 'integer', example: 2017 },
                },
                required: ['id', 'title', 'author', 'year'],
            },
            CreateBook: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'Refactoring' },
                    author: { type: 'string', example: 'Martin Fowler' },
                    year: { type: 'integer', example: 2018 },
                },
                required: ['title', 'author', 'year'],
            },
            UpdateBook: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    author: { type: 'string' },
                    year: { type: 'integer' },
                },
            },
        },
    },
};

const swaggerSpec = swaggerJSDoc({
    definition: swaggerDefinition,
    apis: ['src/routes/**/*.ts'], // comentario: JSDoc anotado en rutas
});

// comentario: montar Swagger UI en /docs
app.use(
    koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: {
            spec: swaggerSpec as unknown as Record<string, unknown>, // <- FIX de tipos
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    })
);

const port = 4000;
app.listen(port, () => {
    console.log(`Koa running on http://localhost:${port}`);
    console.log(`Swagger UI on http://localhost:${port}/docs`);
});
