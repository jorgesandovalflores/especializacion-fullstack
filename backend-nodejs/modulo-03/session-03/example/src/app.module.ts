import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';

@Module({
	imports: [
		LoggerModule.forRoot({
			pinoHttp: {
				level: 'info',
				transport: {
					target: 'pino-loki',
					options: {
						batch: true,
						interval: 5, // segundos
						host: 'http://localhost:3100', // URL de Loki en Docker
						labels: { job: 'nestjs-app' },
					},
				},
			},
		}),
	],
	controllers: [AppController],
})
export class AppModule {}
