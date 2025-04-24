import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
		origin: '*',           // ⚠️ Permite cualquier origen
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: false     // Debe ser false si usas '*'
	});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
