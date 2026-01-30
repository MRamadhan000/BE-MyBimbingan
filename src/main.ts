import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Hapus properti yang tidak ada di DTO
      forbidNonWhitelisted: true,    // Error jika ada properti liar yang dikirim
      transform: true,               // Otomatis ubah tipe data (misal string ke number)
    }),
  );

  app.use(cookieParser());

  await app.listen(3001);
}
bootstrap();