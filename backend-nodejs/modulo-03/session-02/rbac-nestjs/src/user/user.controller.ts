import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class UserController {
	@Get('profile')
	getProfile(@Req() req: Request) {
		return { message: 'Perfil de usuario', user: req.user };
	}

	@Get('admin/users')
	@Roles('admin')
	getAllUsers() {
		return { message: 'Usuarios solo para admin' };
	}

	@Get('reports')
	@Roles('admin', 'supervisor')
	getReports() {
		return { message: 'Reportes visibles para admin y supervisor' };
	}
}