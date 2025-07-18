import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() dto: LoginDto) {
		const user = await this.authService.validateUser(dto.email, dto.password);
		return this.authService.login(user);
	}

	@Post('login-secure')
	async loginSegure(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const user = await this.authService.validateUser(dto.email, dto.password);
		const value = await this.authService.login(user);
		res.cookie('refresh_token', value.refresh_token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		return {
			access_token: value.access_token,
			user: value.user
		};
	}

	@Post('refresh-token')
	async refresh(@Body('refresh_token') token: string) {
		return this.authService.refreshToken(token);
	}

	@Post('refresh-token-secure')
	async refreshSecure(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = req.cookies['refresh_token']
		if (!token) throw new UnauthorizedException()
		const value = await this.authService.refreshToken(token);

		res.cookie('refresh_token', value.refresh_token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
		
		return {
			access_token: (await value).access_token
		}
	}

	@Post('logout')
	async logout() {
		return { message: 'Sesión cerrada' };
	}
}
