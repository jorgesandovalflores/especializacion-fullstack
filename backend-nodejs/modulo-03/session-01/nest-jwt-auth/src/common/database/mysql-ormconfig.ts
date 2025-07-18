import 'dotenv/config';
import { Users } from '../../features/users/users.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.MYSQL_HOST,
	port: Number(process.env.MYSQL_PORT),
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	entities: [Users],
	migrations: ['src/migrations/*.ts'],
	migrationsTableName: 'migrations_history',
	synchronize: false,
});
