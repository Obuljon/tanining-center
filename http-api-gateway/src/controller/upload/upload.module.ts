import { Module } from '@nestjs/common';
import { NatsService } from '../../nats-client/nats.service';
import { NatsClientModule } from '../../nats-client/nats-client.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadController } from './controller/upload.controller';

@Module({
  imports: [NatsClientModule],
  controllers: [UploadController],
  providers: [NatsService],
})
export class UploadModule {}
