import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	email: string;

	@Length(6)
	password: string;
}