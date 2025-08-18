import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import redisConfig from './config/redis.config';
import swaggerConfig from './config/swagger.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormOptions from './database/typeorm.config';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './cache/redis.module';
import { UsersModule } from './features/users/users.module';
import { EventsModule } from './features/events/events.module';
import { SubscriptionsModule } from './features/subscriptions/subscriptions.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [appConfig, dbConfig, redisConfig, swaggerConfig] }),
        LoggerModule,
        TypeOrmModule.forRoot(typeormOptions),
        RedisModule,
        UsersModule,
        AuthModule,
        EventsModule,
        SubscriptionsModule,
        NotificationsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
