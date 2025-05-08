import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	})
	app.useLogger(app.get(Logger))
	app.use(cookieParser())
	app.enableCors({
		origin: 'http://localhost:5173',
		credentials: true,
	})

	const config = new DocumentBuilder()
		.setTitle('Session Auth API')
		.setDescription('Endpoints para login, refresh y perfil')
		.setVersion('1.0')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
