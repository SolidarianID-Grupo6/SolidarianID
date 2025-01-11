import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configura la ruta absoluta para vistas y activos estáticos
  app.setBaseViewsDir('/app/apps/front-end/src/views');
  app.setViewEngine('hbs');
  app.useStaticAssets('/app/apps/front-end/src/public');

  console.log('Views Directory:', '/app/apps/front-end/src/views');
  console.log('Static Assets Directory:', '/app/apps/front-end/src/public');
  

  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
