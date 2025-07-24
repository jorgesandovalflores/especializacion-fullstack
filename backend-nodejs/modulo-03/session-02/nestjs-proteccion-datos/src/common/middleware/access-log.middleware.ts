import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AccessLogMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[AccessLog] ${req.method} ${req.originalUrl}`);
    next();
  }
}
