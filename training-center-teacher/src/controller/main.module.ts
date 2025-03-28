import { Module } from '@nestjs/common';
import { MainCrudController } from './main_crud.controller/main_crud.controller';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from '../model/';
import { MainCrudServiceService } from './main_crud.service/main_crud.service.service';

@Module({
  imports: [
    NatsClientModule,
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
  ],
  controllers: [MainCrudController],
  providers: [MainCrudServiceService],
})
export class MainModule {}
