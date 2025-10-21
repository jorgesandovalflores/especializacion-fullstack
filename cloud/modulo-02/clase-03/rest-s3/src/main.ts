import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [
            "http://localhost:3000",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application running on port ${port}`);
}
bootstrap();
