import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import { loggerConfig } from './config/logger.config';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { JsendFormatter } from './common/jsend-formatter';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

config();

const configService = new ConfigService();

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const uploadPath = 'uploads';

export const uploadDir =
  configService.get('UPLOAD_FOLDER_PATH')?.replace(/[^\w\s/]/g, '') ??
  join(process.cwd(), uploadPath);

const finalUploadDir = uploadDir ? resolve(uploadDir) : join(process.cwd(), uploadPath);

if (!fs.existsSync(finalUploadDir)) {
  fs.mkdirSync(finalUploadDir, { recursive: true });
}


async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 1 }), (err, req, res, next) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      next();
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(new JsendFormatter()));
  // TODO: Update origin as needed
  app.enableCors({ origin: '*', credentials: true });
  await app.listen(3000);
}

bootstrap();
