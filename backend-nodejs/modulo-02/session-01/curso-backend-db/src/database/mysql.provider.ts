import { createPool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

export const mysqlProvider = {
	provide: 'MYSQL_POOL',
	useFactory: async (configService: ConfigService) => {
		return createPool({
			host: configService.get('MYSQL_HOST'),
			port: configService.get('MYSQL_PORT'),
			user: configService.get('MYSQL_USER'),
			password: configService.get('MYSQL_PASSWORD'),
			database: configService.get('MYSQL_DB'),
			waitForConnections: true,
			connectionLimit: 10,
		});
	},
	inject: [ConfigService],
};
