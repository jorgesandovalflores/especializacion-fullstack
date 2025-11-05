import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Event } from "../../events/entities/event.entity";

@Entity({ name: "event_subscriptions" })
@Unique(["user", "event"])
export class EventSubscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (u) => u.subscriptions, {
        eager: true,
        nullable: false,
        onDelete: "CASCADE",
    })
    user: User;

    @ManyToOne(() => Event, (e) => e.subscriptions, {
        eager: true,
        nullable: false,
        onDelete: "CASCADE",
    })
    event: Event;

    @CreateDateColumn({ name: "subscribed_at" })
    subscribedAt: Date;
}
