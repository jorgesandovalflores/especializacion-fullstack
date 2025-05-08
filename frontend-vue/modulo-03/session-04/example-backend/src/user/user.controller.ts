import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtPayload } from './jwt.payload'

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
	@Get('me')
	getMe(@Req() req: Request & { user: JwtPayload }) {
		return { email: req.user.email }
	}
}
