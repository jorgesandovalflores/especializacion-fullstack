import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { I18nService, I18nValidationExceptionFilter } from "nestjs-i18n";
import { ExpressAdapter } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "./core/http/filters/http-exception.filter";
import { IoAdapter } from "@nestjs/platform-socket.io";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(Logger));

    // Configurar WebSockets adapter
    app.useWebSocketAdapter(new IoAdapter(app));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Filtro de validación con manejo seguro de constraints
    app.useGlobalFilters(
        new I18nValidationExceptionFilter(),
        new HttpExceptionFilter(app.get(I18nService)),
    );

    // Configuración de Swagger...
    const config = new DocumentBuilder()
        .setTitle("AppTaxi - api service")
        .setDescription("Documentación de la API")
        .setVersion("0.0.1")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    const httpAdapter = app.getHttpAdapter();

    if (httpAdapter instanceof ExpressAdapter) {
        httpAdapter.getInstance().disable("x-powered-by");
    }

    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    });

    await app.listen(Number(process.env.APPLICATION_PORT));
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
