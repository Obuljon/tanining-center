import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddTeacherDTO, EditTeacherDTO } from '../../../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable } from 'rxjs';
import { NatsService } from '../../../nats-client/nats.service';

@Controller('api/teacher')
export class MainCrudController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private natsService: NatsService,
  ) {}

  @Post('add')
  async add(@Body() body: AddTeacherDTO) {
    try {
      return this.natsService.handleNatsRequest('add-teacher', body);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Put('edit/:_id')
  edit(@Param('_id') _id: string, @Body() body: EditTeacherDTO) {
    return this.natsService.handleNatsRequest('edit-teacher', { _id, ...body });
  }

  @Delete('delete/:_id')
  delete(@Param('_id') _id: string) {
    return this.natsService.handleNatsRequest('delete-teacher', { _id });
  }

  @Get('all/:_page/:_much')
  all(@Param('_page') _page: string, @Param('_much') _much: string) {
    return this.natsService.handleNatsRequest('all-teacher', { _page, _much });
  }

  @Get('findone/:_id')
  findOne(@Param('_id') _id: string) {
    return this.natsService.handleNatsRequest('findone-teacher', { _id });
  }

  @Get('findoneemail/:_email')
  findOneEmail(@Param('_email') _email: string) {
    return this.natsService.handleNatsRequest('findone-email', { _email });
  }
}
