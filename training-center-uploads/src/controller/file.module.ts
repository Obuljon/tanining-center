import { Module } from '@nestjs/common';
import { FileController } from './uploads/file.controller';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { UploadsService } from './uploads.service/uploads.service';
import { NatsService } from './services/nats.service';

@Module({
  imports: [NatsClientModule],
  controllers: [FileController],
  providers: [UploadsService, NatsService],
})
export class ControllerModule {}
