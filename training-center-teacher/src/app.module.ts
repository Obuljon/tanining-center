import { Module } from '@nestjs/common';
import { MainModule } from './controller/main.module';
import { NatsClientModule } from './nats-client/nats-client.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://192.168.1.102:27017/teacher'),
    NatsClientModule,
    MainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
