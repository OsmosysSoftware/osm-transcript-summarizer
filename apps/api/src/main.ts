import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { loggerConfig } from './config/logger.config';


const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();