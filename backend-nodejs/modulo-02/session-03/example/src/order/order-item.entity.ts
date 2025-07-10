import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantity: number;

	@ManyToOne(() => Product, (product) => product.items)
	product: Product;

	@ManyToOne(() => Order, (order) => order.items)
	order: Order;
}
