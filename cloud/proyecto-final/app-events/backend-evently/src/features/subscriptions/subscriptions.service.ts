import {
    BadRequestException,
    Injectable,
    NotFoundException,
    Inject,
    forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventSubscription } from "./entities/event-subscription.entity";
import { EventsService } from "../events/events.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(EventSubscription)
        private readonly repo: Repository<EventSubscription>,
        @Inject(forwardRef(() => EventsService))
        private readonly events: EventsService,

        private readonly users: UsersService,
    ) {}

    async subscribe(userId: string, eventId: string) {
        const user = await this.users.findById(userId);
        const event = await this.events.findById(eventId);
        if (!user) throw new NotFoundException("User not found");
        if (!event) throw new NotFoundException("Event not found");

        try {
            const s = this.repo.create({ user, event });
            return await this.repo.save(s);
        } catch {
            throw new BadRequestException("Already subscribed");
        }
    }

    listByUser(userId: string) {
        return this.repo.find({ where: { user: { id: userId } } });
    }
}
