import { Module } from '@nestjs/common';
import { MainCrudController } from './controller/main_crud.controller';
import { NatsClientModule } from '../../nats-client/nats-client.module';
import { NatsService } from '../../nats-client/nats.service';

@Module({
  imports: [NatsClientModule],
  controllers: [MainCrudController],
  providers: [NatsService],
})
export class CourseModule {}
