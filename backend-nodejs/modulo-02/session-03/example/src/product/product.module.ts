import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductRedisService } from './product.redis.service';
import { ProductController } from './product.controller';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		RedisModule
	],
	controllers: [ProductController],
	providers: [ProductService, ProductRedisService],
	exports: [ProductService, ProductRedisService],
})
export class ProductModule {}
