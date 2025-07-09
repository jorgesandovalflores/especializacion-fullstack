import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
	constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

	findAll() {
		return this.repo.find();
	}

	findOne(id: number) {
		return this.repo.findOne({ where: { id } });
	}

	async create(data: CreateProductDto) {
		const product = this.repo.create(data);
		return await this.repo.save(product);
	}

}
