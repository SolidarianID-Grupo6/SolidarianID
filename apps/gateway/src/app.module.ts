import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersProxyMiddleware } from './users-proxy.middleware';
import { StatisticsProxyMiddleware } from './statistics-proxy.middleware';
import { CommunitysProxyMiddleware } from './communities-proxy.middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersProxyMiddleware)
      .forRoutes({ path: 'users/*', method: RequestMethod.ALL })
      .apply(StatisticsProxyMiddleware)
      .forRoutes({ path: 'statistics/*', method: RequestMethod.ALL })
      .apply(CommunitysProxyMiddleware)
      .forRoutes( { path: 'communities/*', method: RequestMethod.ALL },
                  { path: 'actions/*', method: RequestMethod.ALL },
                  { path: 'causes/*', method: RequestMethod.ALL },
                  { path: 'community-join-request/*', method: RequestMethod.ALL },
                  { path: 'community-requests/*', method: RequestMethod.ALL },
                  { path: 'events/*', method: RequestMethod.ALL });
  }
}
