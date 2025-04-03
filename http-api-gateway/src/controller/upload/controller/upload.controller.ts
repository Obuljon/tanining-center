import {
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
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NatsService } from '../../../nats-client/nats.service';
import { Response } from 'express';
import { Readable } from 'stream';
import { catchError, lastValueFrom } from 'rxjs';

@Controller('api/file/')
export class UploadController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private natsService: NatsService,
  ) { }

  @Get('readphoto/:_filename/:_w/:_h')
  async readFileName(
    @Res() res: Response,
    @Param('_filename') _filename: string,
    @Param('_w') _w: string,
    @Param('_h') _h: string,
  ) {
    const w = Number(_w) ? Number(_w) : 50
    const h = Number(_h) ? Number(_h) : 50

    const result = await lastValueFrom(
      this.natsClient.send('read-photo-open-download', { _filename, _w: w, _h: h }).pipe(
        catchError((err) => {
          const { statusCode, message } = err;
          throw new HttpException(
            message || 'Internal server error',
            statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      )
    )

    if (result.statusCode == 404) {
      return new NotFoundException(result.message)
    }

    const buffer = Buffer.from(result, "base64");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signal the end of the stream

    // Set response headers
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length.toString(),
    });

    // Pipe the stream to the response
    readableStream.pipe(res);

    return result;
  }

  @Get('readfile/:_filename')
  async readPdfFile(@Res() res: Response, @Param('_filename') _filename: string) {
    const result = await lastValueFrom(
      this.natsClient
        .send('read-file-open-download', { _filename }).pipe(
          catchError((err) => {
            const { statusCode, message } = err;
            throw new HttpException(
              message || 'Internal server error',
              statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        )
    )

    const buffer = Buffer.from(result, "base64");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Stream end

    // Faylni yuklab olish uchun sarlavhalar (headers)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${_filename}.pdf"`,
      'Content-Length': buffer.length.toString(),
    });

    // Faylni yuborish
    readableStream.pipe(res);
  }
}
