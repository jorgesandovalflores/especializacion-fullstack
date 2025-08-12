import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // comentario: prefijo global

    const config = new DocumentBuilder()
        .setTitle('Books API (NestJS)')
        .setDescription('CRUD with mock data and Swagger')
        .setVersion('1.0.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
            'bearer'
        )
        .build();

    const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
    SwaggerModule.setup('/docs', app, document, {
        swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
        customSiteTitle: 'Books API Docs (NestJS)',
    });

    await app.listen(3000);
    console.log('NestJS running on http://localhost:3000');
    console.log('Swagger UI on     http://localhost:3000/docs');
}
bootstrap();
