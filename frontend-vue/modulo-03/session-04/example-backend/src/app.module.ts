import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { ConfigModule } from '@nestjs/config' // ✅ importar ConfigModule
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserController } from './user/user.controller'

@Module({
	imports: [
		// ✅ Aquí declaras el ConfigModule como global
		ConfigModule.forRoot({
			isGlobal: true,
		}),

		LoggerModule.forRoot({
			pinoHttp: {
				level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						translateTime: 'HH:MM:ss.l',
					},
				},
			},
		}),
		AuthModule,
	],
	controllers: [AppController, UserController],
	providers: [AppService],
})
export class AppModule {}
