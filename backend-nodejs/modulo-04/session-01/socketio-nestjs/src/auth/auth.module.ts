import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		JwtModule.register({
			secret: 'my_secret_key',
			signOptions: { expiresIn: '12h' }
		}),
	],
	providers: [JwtStrategy],
	exports: [JwtModule],
})
export class AuthModule {}
