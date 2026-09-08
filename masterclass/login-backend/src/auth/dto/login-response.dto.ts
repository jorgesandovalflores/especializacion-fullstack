import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'fake-jwt-token' })
  accessToken: string;

  @ApiProperty({ example: 'admin@masterclass.com' })
  email: string;
}
