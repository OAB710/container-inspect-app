import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { SnakeCaseResponseInterceptor } from './common/snake-case-response.interceptor';
import { SnakeToCamelPipe } from './common/snake-to-camel.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase payload size limit to 50MB (for base64 image uploads)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new SnakeToCamelPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new SnakeCaseResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
