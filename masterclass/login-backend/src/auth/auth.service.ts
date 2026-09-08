import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

const LOGIN_TASK_DELAY_MS = 1500;

const HARDCODED_CREDENTIALS = {
  email: 'admin@masterclass.com',
  password: 'Admin123!',
};

@Injectable()
export class AuthService {
  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    await this.simulateExpensiveTask();

    const isValid =
      email === HARDCODED_CREDENTIALS.email &&
      password === HARDCODED_CREDENTIALS.password;

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return { accessToken: 'fake-jwt-token', email };
  }

  private simulateExpensiveTask(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, LOGIN_TASK_DELAY_MS));
  }
}
