import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UserMysqlService } from './user-mysql.service';

@Controller('users-mysql')
export class UserMysqlController {
	constructor(private readonly service: UserMysqlService) {}

	@Get('all')
	findAll() {
		return this.service.findAll();
	}

	@Get('find/:id')
	findOne(@Param('id') id: number) {
		return this.service.findOne(id);
	}

	@Post('create')
	create(@Body() data: any) {
		return this.service.create(data);
	}

	@Put('update/:id')
	update(@Param('id') id: number, @Body() data: any) {
		return this.service.update(id, data);
	}

	@Delete('delete/:id')
	delete(@Param('id') id: number) {
		return this.service.delete(id);
	}

	// Ineguro con parámetros
	@Get('injection')
	async vulnerable(@Query('email') email: string) {
		return this.service.rawQueryUnsafe(email);
	}

	// Seguro con parámetros
	@Get('safe')
	async safe(@Query('email') email: string) {
		return this.service.rawQuerySafe(email);
	}
}