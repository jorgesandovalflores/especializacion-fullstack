import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
    providers: [RedisService, ConfigService],
    exports: [RedisService],
})
export class RedisModule {}
