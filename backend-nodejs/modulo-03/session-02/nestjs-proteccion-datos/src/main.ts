import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessLogMiddleware } from './common/middleware/access-log.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new AccessLogMiddleware().use);
  await app.listen(3000);
}
bootstrap();