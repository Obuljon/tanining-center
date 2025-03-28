import {  NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: Logger = new Logger('Listen');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log('Server is running on port 3000');
  });
}
bootstrap();
