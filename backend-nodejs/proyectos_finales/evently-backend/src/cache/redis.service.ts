import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private readonly config: ConfigService) {}

    async onModuleInit(): Promise<void> {
        this.client = new Redis({
            host: this.config.get<string>('redis.host'),
            port: this.config.get<number>('redis.port'),
            db: this.config.get<number>('redis.db'),
            password: this.config.get<string>('redis.password'),
            lazyConnect: true,
            maxRetriesPerRequest: 3,
        });
        await this.client.connect();
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client) await this.client.quit();
    }

    getClient(): Redis {
        return this.client;
    }
}
