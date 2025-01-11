import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class UsersProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'http://localhost:3002', // Microservicio de users
    changeOrigin: true, // Permite solicitudes de diferentes dominios
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
