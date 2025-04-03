import { Module } from '@nestjs/common';
import { NatsClientModule } from './nats-client/nats-client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ControllerModule } from './controller/file.module';

@Module({
  imports: [
    NatsClientModule,
    MongooseModule.forRoot("mongodb://root:training-center@mongodb:27017",{
      authSource:"admin"
    }),
    ControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
