import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Post()
	create(@Body() body: CreateUserDto) {
		return this.userService.create(body);
	}

	@Get('with-order-count')
	async getUsersWithOrderCount() {
		return this.userService.findUsersWithOrderCount();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

}
