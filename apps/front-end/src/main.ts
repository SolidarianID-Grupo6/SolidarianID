import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as exphbs from 'express-handlebars';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: ('/app/apps/front-end/src/views/layouts'),
    partialsDir: ('/app/apps/front-end/src/views/partials'),
    helpers: {
      eq: (a, b) => a === b,
      plusOne: (index) => index + 1,
      calcPercentage: (progress, goal) => ((progress / goal) * 100).toFixed(2),
    } 
  }));

  app.setViewEngine('hbs');
  app.setBaseViewsDir('/app/apps/front-end/src/views');
  app.useStaticAssets('/app/apps/front-end/src/public');
  app.useStaticAssets('/app/apps/front-end/src/common/interfaces');

  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
