import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const config = app.get(ConfigService);

    app.setGlobalPrefix(config.get<string>("globalPrefix") ?? "/api");
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.enableCors({ origin: true, credentials: true });

    const s = config.get("swagger");
    const builder = new DocumentBuilder()
        .setTitle(s.title)
        .setDescription(s.description)
        .setVersion(s.version)
        .addBearerAuth()
        .build();
    const doc = SwaggerModule.createDocument(app, builder);
    SwaggerModule.setup("api/docs", app, doc);

    await app.listen(config.get<number>("port") ?? 3000);
    const url = await app.getUrl();
    console.log(
        `Evently on ${url}${config.get("globalPrefix")} (Swagger: ${url}/docs)`,
    );
}
bootstrap();
