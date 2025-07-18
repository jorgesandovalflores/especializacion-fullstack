import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Users {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	role: string;

	@Column()
	name: string;

	@Column()
	lastname: string;

	@Column({unique: true})
	email: string;

	@Column()
	password: string;
}
