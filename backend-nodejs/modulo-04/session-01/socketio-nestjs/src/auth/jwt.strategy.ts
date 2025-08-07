import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'my_secret_key', // Reemplazar con env variable segura
		})
	}

	async validate(payload: any) {
		// Se puede consultar la BD si es necesario
		return { userId: payload.sub, username: payload.username }
	}
}
