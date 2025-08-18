import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

@Module({
    imports: [
        WinstonModule.forRoot({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.json(),
            ),
            transports: [ new transports.Console() ],
        }),
    ],
})
export class LoggerModule {}
