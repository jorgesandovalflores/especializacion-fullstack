import * as winston from 'winston';

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ level, message, timestamp }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		})
	),
	transports: [new winston.transports.Console()]
});
