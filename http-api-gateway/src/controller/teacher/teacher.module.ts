import { Module } from '@nestjs/common';
import { NatsClientModule } from '../../nats-client/nats-client.module';
import { MainCrudController } from './conteoller/main_crud.controller';
import { NatsService } from '../../nats-client/nats.service';

@Module({
  imports: [NatsClientModule],
  controllers: [MainCrudController],
  providers: [NatsService],
})
export class TeacherModule {}
