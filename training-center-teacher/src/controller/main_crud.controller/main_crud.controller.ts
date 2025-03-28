import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { NatsClientModule } from '../../nats-client/nats-client.module';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ExceptionFilter } from '../../nats-client';
import { MainCrudServiceService } from '../main_crud.service/main_crud.service.service';
@UseFilters(new ExceptionFilter())
@Controller()
export class MainCrudController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: NatsClientModule,
    private teacherService: MainCrudServiceService,
  ) {}

  ///////////////////////

  @MessagePattern('add-teacher')
  async add(@Payload() body: any) {
    const { email } = body;
    const isThere = await this.teacherService.findOneEmail(email);
    if (isThere)
      throw new RpcException({
        statusCode: 401,
        message: 'This email is available in the database.',
      });

    const adddata = await this.teacherService.add(body);
    if (adddata === null)
      throw new RpcException({
        statusCode: 400,
        message: 'Error in teacher microservice',
        error: 'BAD_REQUEST',
      });
    else {
      return adddata;
    }
  }

  // /////////////////////

  @MessagePattern('edit-teacher')
  async edit(@Payload() body: any) {
    const { _id } = body;

    const isThere = await this.teacherService.findbyId(_id);
    if (!isThere)
      throw new RpcException({ statusCode: 404, message: 'Not found !!' });

    const update = await this.teacherService.editbyID(_id, body);

    if (update) return this.teacherService.findbyId(_id);
    else throw new RpcException({ statusCode: 400, message: 'Bad Request' });
  }

  // ////////////////////////////////////

  @MessagePattern('all-teacher')
  async all(@Payload() data: any) {
    const { _much, _page }: { _much: number; _page: number } = data;
    return this.teacherService.findAll(_page, _much);
  }

  /////////////////////////////////////////////////

  @MessagePattern('findone-teacher')
  async findbyid(@Payload() { _id }: { _id: string }) {
    const data = await this.teacherService.findbyId(_id);
    // agar data teng bo'lsa null ga
    if (!data)
      throw new RpcException({ statusCode: 404, message: 'Not found !!' });
    // ////////

    return data;
  }

  // ///////////////////////////////////////////////////////

  @MessagePattern('findone-email')
  async findOneEmail(@Payload() { _email }: any) {
    const data = await this.teacherService.findOneEmail(_email);

    if (!data)
      throw new RpcException({ statusCode: 404, message: 'Not found !!' });

    return data;
  }

  //////////////////////////////////////////////////////////////////////

  @MessagePattern('delete-teacher')
  async deletebyID(@Payload() { _id }) {
    const data = await this.teacherService.findbyId(_id);
    if (!data)
      throw new RpcException({ statusCode: 404, message: 'Not found !!' });

    return await this.teacherService.deletabyID(_id);
  }
}
