import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger: Logger = new Logger('UploadService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_SERVER || 'nats://4222'],
      },
    },
  );

  logger.log(
    `Upload service running and connected to NATS server at ${process.env.NATS_SERVER || 'nats://4222'}`,
  );

  await app.listen().catch((err) => {
    logger.error('Failed to start microservice', err);
  });
}

bootstrap();
