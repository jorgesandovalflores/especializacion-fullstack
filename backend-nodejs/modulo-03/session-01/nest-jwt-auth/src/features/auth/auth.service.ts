import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) throw new UnauthorizedException('Credenciales inválidas');

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

		return user;
	}

	async login(user: any) {
		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role,
		};

		const access_token = await this.jwtService.signAsync(payload, {
			expiresIn: this.config.get<string>('JWT_EXPIRES_IN') || '15m',
		});

		const refresh_token = await this.jwtService.signAsync(payload, {
			expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
		});

		return {
			access_token,
			refresh_token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}

	async refreshToken(token: string) {
		try {
			const payload = await this.jwtService.verifyAsync(token);
			const user = await this.usersService.findByEmail(payload.email);
			if (!user) throw new UnauthorizedException();

			const new_access_token = await this.jwtService.signAsync(
				{
					sub: user.id,
					email: user.email,
					role: user.role,
				},
				{ 
					expiresIn: this.config.get<string>('JWT_EXPIRES_IN') || '15m'
				},
			);

			const new_refresh_token = await this.jwtService.signAsync(
				{
					sub: user.id,
					email: user.email,
					role: user.role,
				}, 
				{
					expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
				}
			);

			return { access_token: new_access_token, refresh_token: new_refresh_token };
		} catch (err) {
			throw new UnauthorizedException('Refresh token inválido');
		}
	}
}
