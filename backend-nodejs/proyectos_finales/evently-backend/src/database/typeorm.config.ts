import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { User } from '../features/users/entities/user.entity';
import { Event } from '../features/events/entities/event.entity';
import { EventSubscription } from '../features/subscriptions/entities/event-subscription.entity';

const options: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Event, EventSubscription],
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    logging: (process.env.DB_LOGGING ?? 'true') === 'true',
    migrations: [
        'dist/database/migrations/*.js',
    ],
};

export const AppDataSource = new DataSource(options);
export default options;
