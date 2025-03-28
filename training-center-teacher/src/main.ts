import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger: Logger = new Logger('TeacherService');
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
    `Teacher service running and connected to NATS server at ${process.env.NATS_SERVER || 'nats://4222'}`,
  );

  await app.listen().catch((err) => {
    logger.error('Failed to start microservice', err);
  });
}
bootstrap();
