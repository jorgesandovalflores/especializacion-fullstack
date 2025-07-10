import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRedisService } from './product.redis.service';

@Controller('products')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly productRedisService: ProductRedisService
	) {}

	@Get()
	findAll() {
		return this.productRedisService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productService.findOne(+id);
	}

	@Post()
	create(@Body() body: CreateProductDto) {
		return this.productService.create(body);
	}
}
