import { Controller, Get, Headers, Query } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { toAdmin, toPublic } from './mappers/user.mapper';

@Controller('users')
export class UserController {
  private mockUser: UserEntity = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed',
    role: 'user',
    ssn: '123-45-6789',
  };

  @Get('me')
  getMyData(@Headers('x-role') role: string) {
    return role === 'admin'
      ? toAdmin(this.mockUser)
      : toPublic(this.mockUser);
  }
}