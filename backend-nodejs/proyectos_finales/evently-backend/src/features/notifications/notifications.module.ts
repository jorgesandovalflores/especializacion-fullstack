import { Module, forwardRef } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        forwardRef(() => SubscriptionsModule),
        JwtModule.register({}),
    ],
    providers: [NotificationsGateway],
    exports: [NotificationsGateway],
})
export class NotificationsModule {}
