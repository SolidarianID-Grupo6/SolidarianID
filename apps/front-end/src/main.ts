import { NestFactory } from '@nestjs/core';
import { FrontEndModule } from './front-end.module';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    FrontEndModule,
    new FastifyAdapter(),
  );

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
  });

  await app.listen(process.env.port ?? 3004);
}
bootstrap();
