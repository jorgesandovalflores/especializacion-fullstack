import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export const postgresProvider = {
	provide: 'POSTGRES_POOL',
	useFactory: async (configService: ConfigService) => {
		return new Pool({
			host: configService.get('POSTGRES_HOST'),
			port: configService.get('POSTGRES_PORT'),
			user: configService.get('POSTGRES_USER'),
			password: configService.get('POSTGRES_PASSWORD'),
			database: configService.get('POSTGRES_DB'),
			max: 10,
		});
	},
	inject: [ConfigService],
};
