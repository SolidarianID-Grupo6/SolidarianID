import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as exphbs from 'express-handlebars';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configura express-handlebars con opciones personalizadas, incluyendo partials
  app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'layout', // Asegúrate de tener un layout (por ejemplo, layout.hbs)
    layoutsDir: ('/app/apps/front-end/src/views/layouts'),
    partialsDir: ('/app/apps/front-end/src/views/partials'),
  }));

  // Configura el motor de vistas y las carpetas de vistas y activos estáticos
  app.setViewEngine('hbs');
  app.setBaseViewsDir('/app/apps/front-end/src/views');
  app.useStaticAssets('/app/apps/front-end/src/public');

  console.log('Views Directory:', ('/app/apps/front-end/src/views'));
  console.log('Static Assets Directory:', ('/app/apps/front-end/src/public'));

  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
