import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: Logger) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const status =
			exception instanceof HttpException ? exception.getStatus() : 500;

		const message =
			exception instanceof HttpException
				? exception.getResponse()
				: exception;

		const traceId = request.headers['x-trace-id'] || 'N/A';

		this.logger.error(
			{
				message: 'Error capturado por AllExceptionsFilter',
				traceId,
				path: request.url,
				method: request.method,
				error: exception,
			},
			'Exception',
		);

		response.status(status).json({
			statusCode: status,
			message,
			traceId,
			timestamp: new Date().toISOString(),
		});
	}
}