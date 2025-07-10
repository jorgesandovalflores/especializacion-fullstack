import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.orders)
	user: User;

	@OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
	items: OrderItem[];
}
