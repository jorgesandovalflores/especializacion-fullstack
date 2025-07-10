import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { RedisService } from 'src/common/redis/redis.service';

const CACHE_PREFIX = 'product';
const CACHE_TTL_SECONDS = 86400; // 1 día en segundos (Redis usa segundos, no ms)

@Injectable()
export class ProductRedisService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    private readonly redis: RedisService
  ) {}

  private getAllKey(): string {
    return `${CACHE_PREFIX}:all`;
  }

  private getOneKey(id: number): string {
    return `${CACHE_PREFIX}:${id}`;
  }

  async findAll(): Promise<Product[]> {
    const key = this.getAllKey();
    const cached = await this.redis.get<Product[]>(key);

    if (cached) {
      console.log(`[CACHE] findAll → datos desde Redis [${key}]`);
      return cached;
    }

    console.log('[DB] findAll → datos desde base de datos');
    const products = await this.repo.find();
    await this.redis.set(key, products, CACHE_TTL_SECONDS);
    console.log(`[CACHE] findAll → guardado en Redis [${key}]`);

    return products;
  }

  async findOne(id: number): Promise<Product | null> {
    const key = this.getOneKey(id);
    const cached = await this.redis.get<Product>(key);

    if (cached) {
      console.log(`[CACHE] findOne(${id}) → datos desde Redis [${key}]`);
      return cached;
    }

    console.log(`[DB] findOne(${id}) → datos desde base de datos`);
    const product = await this.repo.findOne({ where: { id } });

    if (product) {
      await this.redis.set(key, product, CACHE_TTL_SECONDS);
      console.log(`[CACHE] findOne(${id}) → guardado en Redis [${key}]`);
    }

    return product;
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.repo.create(data);
    const saved = await this.repo.save(product);

    console.log(`[DB] create → producto creado (id=${saved.id}), actualizando caché...`);

    await this.redis.set(this.getOneKey(saved.id), saved, CACHE_TTL_SECONDS);
    await this.redis.del(this.getAllKey());

    return saved;
  }
  
}