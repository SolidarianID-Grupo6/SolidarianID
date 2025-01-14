import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('SolidarianID API')
  .setDescription('Combined API documentation for SolidarianID services')
  .setVersion('1.0')
  .addCookieAuth('accessToken')
  .build();
