import { Role } from "src/core/http/enums/role.enum";
import { Event } from "../../../features/events/entities/event.entity";
import { EventSubscription } from "../../../features/subscriptions/entities/event-subscription.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 150 })
    name: string;

    @Index({ unique: true })
    @Column({ length: 180 })
    email: string;

    @Column({ name: "password_hash", length: 255, select: false })
    passwordHash: string;

    @Column({ type: "enum", enum: Role, default: Role.ATTENDEE })
    role: Role;

    @OneToMany(() => Event, (e) => e.createdBy)
    events: Event[];

    @OneToMany(() => EventSubscription, (s) => s.user)
    subscriptions: EventSubscription[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
