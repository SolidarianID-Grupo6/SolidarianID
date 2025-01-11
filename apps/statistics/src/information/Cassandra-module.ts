import { Module, DynamicModule, Global } from '@nestjs/common';
import { Client, ClientOptions } from 'cassandra-driver';

@Global()
@Module({})
export class CassandraModule {
  static forRoot(options: ClientOptions): DynamicModule {
    const cassandraProvider = {
      provide: 'CASSANDRA_CLIENT',
      useFactory: async () => {
        const client = new Client(options);
        await client.connect();
        return client;
      },
    };

    return {
      module: CassandraModule,
      providers: [cassandraProvider],
      exports: [cassandraProvider],
    };
  }
}
