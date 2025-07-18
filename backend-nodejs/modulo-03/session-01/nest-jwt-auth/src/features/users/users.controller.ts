import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@GetUserId() userId: number) {
        const user = await this.usersService.findById(userId);
        return {
            id: user?.id ?? '',
            role: user?.role ?? '',
            name: user?.name ?? '',
            lastname: user?.lastname ?? '',
            email: user?.email ?? '',
        };
    }
}
