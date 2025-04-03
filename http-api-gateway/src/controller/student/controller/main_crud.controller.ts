import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NatsService } from '../../../nats-client/nats.service';

@Controller('api/student')
export class MainCrudController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private natsService: NatsService,
  ) {}

  @Post('add')
  add(@Body() body: any) {
    return this.natsService.handleNatsRequest('add-student', body);
  }

  @Put('edit/:_id')
  edit(@Body() body: any, @Param('_id') _id: string) {
    return this.natsService.handleNatsRequest('edit-student', { ...body, _id });
  }

  @Delete('delete/:_id')
  deletebyID(@Param('_id') _id: string) {
    return this.natsService.handleNatsRequest('delete-student', { _id });
  }
}
