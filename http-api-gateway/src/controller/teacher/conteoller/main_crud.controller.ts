import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AddTeacherDTO, EditTeacherDTO } from '../../../dtos';
import { ClientProxy } from '@nestjs/microservices';
import { NatsService } from '../../../nats-client/nats.service';
import { extname } from 'path';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/teacher')
export class MainCrudController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private natsService: NatsService,
  ) { }

  @Post('add')
  async add(@Body() body: AddTeacherDTO) {
    try {
      return this.natsService.handleNatsRequest('add-teacher', body);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('uploadphoto/:_id')
  @UseInterceptors(FileInterceptor('file',
    {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png',];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
      },
    }
  ))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('_id') _id: string,
  ) {
    const fileData = {
      originalname: uuidv4() + extname(file.originalname),
      buffer: file.buffer.toString('base64'), // Convert buffer to base64
      mimetype: file.mimetype,
      size: file.size,
    };
    return this.natsService.handleNatsRequest('edit-photo-teacher', {
      _id,
      fileData,
    });

  }


  @Post('uploadresume/:_id')
  @UseInterceptors(FileInterceptor('resume',
    {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
      },
    }
  ))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Param('_id') _id: string,
  ) {
    const fileData = {
      originalname: uuidv4() + extname(file.originalname),
      buffer: file.buffer.toString('base64'),
      mimetype: file.mimetype,
      size: file.size,
    };

    return this.natsService.handleNatsRequest('edit-resume-teacher', {
      _id,
      fileData,
    })
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
