import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes any additional properties from the request body
      forbidNonWhitelisted: true, // Throws an error if any additional properties are present,
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
