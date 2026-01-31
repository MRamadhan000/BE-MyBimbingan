import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Mengaktifkan Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Hapus properti yang tidak ada di DTO
      forbidNonWhitelisted: true,    // Error jika ada properti liar yang dikirim
      transform: true,               // Otomatis ubah tipe data (misal string ke number)
    }),
  );

  app.use(cookieParser());

  // Configure body parser for multipart/form-data
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Removed static assets serving for security - files will be served via protected endpoints

  const logger = new Logger('Bootstrap');
  await app.listen(3000);
  logger.log('🚀 Application is running on: http://localhost:3000');
}
bootstrap();