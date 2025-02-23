import { NestFactory } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const options = new DocumentBuilder()
    .setTitle('SolidarianID-users')
    .setDescription(
      'The SolidarianID, a platform that helps solidarity with your own ID.\n\n' +
        '## Authentication\n' +
        'Authentication is handled via HTTP-only cookies containing JWT tokens. **Get the token from the login endpoint.**\n\n' +
        '### Cookie Structure\n' +
        '```\n' +
        'accessToken=j:{\n' +
        '  "accessToken": "[JWT_ACCESS_TOKEN]",\n' +
        '  "refreshToken": "[JWT_REFRESH_TOKEN]"\n' +
        '}\n' +
        '```\n\n' +
        '### Cookie Properties\n' +
        '- Path: /\n' +
        '- HttpOnly: true\n' +
        '- Secure: true\n' +
        '- SameSite: Strict\n\n',
    )
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      description: 'JWT access token stored in HTTP-only cookie',
    })
    .addServer('http://localhost:3002')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port ?? 3002);
}
bootstrap();
