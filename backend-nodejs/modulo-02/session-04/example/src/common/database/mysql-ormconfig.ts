import 'dotenv/config';
import { DataSource } from 'typeorm';
import { OrderItem } from '../../order/order-item.entity';
import { Order } from '../../order/order.entity';
import { Product } from '../../product/product.entity';
import { User } from '../../user/user.entity';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.MYSQL_HOST,
	port: Number(process.env.MYSQL_PORT),
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	entities: [User, Order, OrderItem, Product],
	migrations: ['src/migrations/*.ts'],
	migrationsTableName: 'migrations_history',
	synchronize: false,
});
