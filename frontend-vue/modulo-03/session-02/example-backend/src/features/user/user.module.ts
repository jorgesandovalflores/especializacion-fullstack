import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret123',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
