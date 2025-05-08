import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private auth: AuthService) {}

	@Post('login')
	@ApiResponse({ status: 201, description: 'Login exitoso' })
	login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { email, password } = body
		if (!this.auth.validateUser(email, password)) throw new UnauthorizedException()

		const { accessToken, refreshToken } = this.auth.login(email)

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		return { access_token: accessToken }
	}

	@Post('refresh')
	@ApiResponse({ status: 200, description: 'Token renovado' })
	refresh(@Req() req: Request) {
		const token = req.cookies['refresh_token']
		if (!token) throw new UnauthorizedException()

		const payload = this.auth.verifyToken(token)
		const newAccess = this.auth.login(payload.email).accessToken
		return { access_token: newAccess }
	}
}
