import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SnakeCaseResponseInterceptor } from './common/snake-case-response.interceptor';
import { SnakeToCamelPipe } from './common/snake-to-camel.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
