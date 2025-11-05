import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./features/users/users.module";
import { EventsModule } from "./features/events/events.module";
import { SubscriptionsModule } from "./features/subscriptions/subscriptions.module";
import { NotificationsModule } from "./features/notifications/notifications.module";
import { AppController } from "./app.controller";
import appConfig from "./core/config/app.config";
import dbConfig from "./core/config/db.config";
import redisConfig from "./core/config/redis.config";
import swaggerConfig from "./core/config/swagger.config";
import { LoggerModule } from "./core/logger/logger.module";
import typeormOptions from "./core/database/typeorm.config";
import { RedisModule } from "./core/cache/redis.module";
import { AuthModule } from "./features/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, dbConfig, redisConfig, swaggerConfig],
        }),
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
