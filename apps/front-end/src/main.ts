import { NestFactory } from '@nestjs/core';
import { FrontEndModule } from './front-end.module';

async function bootstrap() {
  const app = await NestFactory.create(FrontEndModule);
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
