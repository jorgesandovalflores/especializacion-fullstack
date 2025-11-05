import {
    Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EventSubscription } from '../../../features/subscriptions/entities/event-subscription.entity';

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
}

@Entity({ name: 'events' })
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 200 })
    location: string;

    @Index()
    @Column({ type: 'datetime' })
    date: Date;

    @Index()
    @Column({ type: 'enum', enum: EventStatus, default: EventStatus.ACTIVE })
    status: EventStatus;

    @ManyToOne(() => User, (u) => u.events, { eager: true, nullable: false })
    createdBy: User;

    @OneToMany(() => EventSubscription, (s) => s.event)
    subscriptions: EventSubscription[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
