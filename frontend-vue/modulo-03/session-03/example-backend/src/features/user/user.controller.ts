import { Controller, Post, Get, Param, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.userService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() dto: CreateUserDto) {
        return this.userService.update(+id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.userService.remove(+id);
    }
}