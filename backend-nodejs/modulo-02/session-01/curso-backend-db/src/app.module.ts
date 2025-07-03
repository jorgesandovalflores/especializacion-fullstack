import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mysqlProvider } from './database/mysql.provider';
import { postgresProvider } from './database/postgres.provider';
import { UserMysqlController } from './user-mysql/user-mysql.controller';
import { UserMysqlService } from './user-mysql/user-mysql.service';
import { UserPostgresController } from './user-postgres/user-postgres.controller';
import { UserPostgresService } from './user-postgres/user-postgres.service';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true })],
	controllers: [UserMysqlController, UserPostgresController],
	providers: [
		mysqlProvider,
		postgresProvider,
		UserMysqlService,
		UserPostgresService,
	],
})
export class AppModule {}
