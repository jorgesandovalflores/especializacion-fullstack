import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private readonly repo: Repository<Users>,
	) {}

	async findById(id: number): Promise<Users | null> {
		return this.repo.findOne({ where: { id } });
	}

	async findByEmail(email: string) {
		return this.repo.findOne({ where: { email } });
	}
}
