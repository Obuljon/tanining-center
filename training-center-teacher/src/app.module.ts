import { Module } from '@nestjs/common';
import { MainModule } from './controller/main.module';
import { NatsClientModule } from './nats-client/nats-client.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://root:training-center@mongodb:27017", {
      authSource: 'admin',
    }),
    NatsClientModule,
    MainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
