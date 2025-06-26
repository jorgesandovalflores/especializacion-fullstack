import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger';
const debug = require('debug')('app:bootstrap');

async function bootstrap() {
	debug('Iniciando la aplicación NestJS'); // Debug visible si habilitamos DEBUG=app:* al ejecutar
	const app = await NestFactory.create(AppModule);

	logger.info('Aplicación iniciada correctamente'); // Log estructurado con winston

	await app.listen(3000);
}
bootstrap();
