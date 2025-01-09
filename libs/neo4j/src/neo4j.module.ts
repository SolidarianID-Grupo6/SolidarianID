import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { ConfigModule } from '@nestjs/config';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './constants/neo4j.constants';
import { Neo4jConfig } from './interfaces/neo4j-config.interface';
import { createDriver } from './utils/neo4j.util';

@Module({
  providers: [Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jModule {
  static forRootAsync(configProvider): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        {
          provide: NEO4J_CONFIG,
          ...configProvider,
        } as Provider<any>,
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}
