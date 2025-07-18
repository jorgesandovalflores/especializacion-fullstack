import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './features/users/users.entity';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
		type: 'mysql',
		host: process.env.MYSQL_HOST,
		port: Number(process.env.MYSQL_PORT),
		username: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DB,
		entities: [Users],
		synchronize: true,
		poolSize: 4
	}),
	AuthModule,
	UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
