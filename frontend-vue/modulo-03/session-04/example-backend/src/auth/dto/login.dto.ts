// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
	@ApiProperty({ example: 'user@example.com' })
	email: string

	@ApiProperty({ example: '123456' })
	password: string
}
