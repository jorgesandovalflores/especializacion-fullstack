import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { HttpCustomException } from './common/exceptions/http-custom.exception';
import { Logger } from 'nestjs-pino';

@Controller()
export class AppController {
	constructor(private readonly logger: Logger) {}

	@Get('error')
	simulateError(@Req() request: Request) {
		const traceId = request.headers['x-trace-id'] || 'N/A';

		this.logger.warn({
			message: 'Se va a lanzar una excepción',
			traceId,
		});

		throw new HttpCustomException(
			400,
			'Este es un error de prueba',
			{ module: 'AppController', requestId: traceId },
		);
	}

	@Get('ok')
	ok(@Req() request: Request) {
		const traceId = request.headers['x-trace-id'] || 'N/A';

		this.logger.log({
			message: 'Petición exitosa',
			traceId,
		});

		return {
			message: 'Todo bien',
			traceId,
		};
	}
}