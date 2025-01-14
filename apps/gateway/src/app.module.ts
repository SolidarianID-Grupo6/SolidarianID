import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersProxyMiddleware } from './users-proxy.middleware';
import { StatisticsProxyMiddleware } from './statistics-proxy.middleware';
import { CommunitysProxyMiddleware } from './communities-proxy.middleware';
import { NextFunction } from 'http-proxy-middleware/dist/types';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Add logging middleware
    const logPathMiddleware = (req: Request, res: Response, next: NextFunction) => {
      console.log('Request Path:', req)
      next();
    };

    consumer
      .apply(logPathMiddleware, UsersProxyMiddleware)
      .forRoutes({ path: 'users/*', method: RequestMethod.ALL })
      .apply(logPathMiddleware, StatisticsProxyMiddleware)
      .forRoutes({ path: 'statistics/*', method: RequestMethod.ALL })
      .apply(logPathMiddleware, CommunitysProxyMiddleware)
      .forRoutes(
        { path: 'communities/*', method: RequestMethod.ALL },
        { path: 'actions/*', method: RequestMethod.ALL },
        { path: 'causes/*', method: RequestMethod.ALL },
        { path: 'community-join-request/*', method: RequestMethod.ALL },
        { path: 'community-requests/*', method: RequestMethod.ALL },
        { path: 'events/*', method: RequestMethod.ALL }
      );
  }
}