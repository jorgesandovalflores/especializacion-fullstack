import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { LoginResponseDto } from './../src/auth/dto/login-response.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  it('/auth/login (POST) devuelve 200 con credenciales válidas', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@masterclass.com', password: 'Admin123!' })
      .expect(200)
      .expect((res) => {
        expect((res.body as LoginResponseDto).accessToken).toBe(
          'fake-jwt-token',
        );
      });
  });

  it('/auth/login (POST) devuelve 401 con credenciales inválidas', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@masterclass.com', password: 'incorrecta' })
      .expect(401);
  });

  it('/auth/login (POST) devuelve 400 si el body es inválido', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'no-es-un-email', password: '123' })
      .expect(400);
  });
});
