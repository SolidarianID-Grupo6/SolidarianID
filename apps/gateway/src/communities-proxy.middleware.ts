import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class CommunitysProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'http://communities:3001',
    changeOrigin: true,
    timeout: 60000, // Increase timeout to 60 seconds
    proxyTimeout: 60000, // Add proxy timeout
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}