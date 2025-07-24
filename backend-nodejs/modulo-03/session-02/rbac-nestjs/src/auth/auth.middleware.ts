import { NestMiddleware } from '@nestjs/common';
import { AuthenticatedRequest } from './user-request.interface';
import { NextFunction } from 'express';

export class AuthMiddleware implements NestMiddleware {
	use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		req.user = {
			id: 1,
			role: 'supervisor',
			permissions: ['view_reports'],
		};
		next();
	}
}
