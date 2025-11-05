import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventSubscription } from "./entities/event-subscription.entity";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { EventsModule } from "../events/events.module";
import { UsersModule } from "../users/users.module";
import { MeController } from "./me.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([EventSubscription]),
        forwardRef(() => EventsModule),
        UsersModule,
    ],
    providers: [SubscriptionsService],
    controllers: [SubscriptionsController, MeController],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
