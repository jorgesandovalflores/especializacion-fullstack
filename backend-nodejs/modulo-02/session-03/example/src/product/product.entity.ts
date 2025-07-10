import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from '../order/order-item.entity';

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column('decimal')
	price: number;

	@OneToMany(() => OrderItem, (item) => item.product)
	items: OrderItem[];
}
