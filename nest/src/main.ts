import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // Adresse de ton application Angular ou d'un autre client
  });
  await app.listen(3000);
}
bootstrap();
