import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createCombinedSwagger } from './swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = await createCombinedSwagger();
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
