import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});
	app.useLogger(app.get(Logger));
	app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));
	await app.listen(3200);
}
bootstrap();