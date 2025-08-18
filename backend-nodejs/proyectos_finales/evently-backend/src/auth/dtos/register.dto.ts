import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty() @IsNotEmpty()
    name: string;

    @ApiProperty() @IsEmail()
    email: string;

    @ApiProperty() @MinLength(6)
    password: string;
}