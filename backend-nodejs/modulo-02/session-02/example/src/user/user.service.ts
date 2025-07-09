import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	findAll() {
		return this.repo.find({ relations: ['orders'] });
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { id }, relations: ['orders'] });
	}

	async create(data: CreateUserDto) {
		const user = this.repo.create(data);
		return await this.repo.save(user);
	}

}
