// src/common/interceptors/logging.interceptor.ts
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private logger = new Logger('HTTP');

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const method = request.method;
		const url = request.url;
		const now = Date.now();

		return next.handle().pipe(
			tap(() => {
				const responseTime = Date.now() - now;
				this.logger.log(`${method} ${url} - ${responseTime}ms`);
			}),
		);
	}
}
