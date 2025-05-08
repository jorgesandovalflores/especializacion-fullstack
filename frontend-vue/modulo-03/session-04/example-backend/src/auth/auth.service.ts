import { Injectable, Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
	constructor(private jwt: JwtService) {}

	private readonly logger = new Logger(AuthService.name)

	validateUser(email: string, password: string) {
		const isValid = email === 'user@example.com' && password === '123456'
		this.logger.debug(`Validando usuario ${email}: ${isValid}`)
		return isValid
	}

	login(email: string) {
		this.logger.log(`Generando tokens para ${email}`)
		const payload = { email }
		return {
			accessToken: this.jwt.sign(payload, { expiresIn: '1m' }),
			refreshToken: this.jwt.sign(payload, { expiresIn: '1d' }),
		}
	}

	verifyToken(token: string) {
		return this.jwt.verify(token)
	}
}