import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/');
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const config = new DocumentBuilder()
    .setTitle('Hotel APi')
    .setDescription(
      'Welcome to the Hotel Management API. This API provides endpoints for managing hotel operations including room bookings, guest information, amenities, and services. It allows you to handle reservations, check-ins/check-outs, room inventory, and other hotel-related functionalities in a secure and efficient manner.',
    )
    .setVersion('1.0')
    .addTag('hotel')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
