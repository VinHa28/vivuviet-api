import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ProblemDetailsFilter } from './common/filters/problem-details.filters.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new ProblemDetailsFilter);
  app.useGlobalPipes(
    new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true})
  )
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
