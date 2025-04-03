import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UploadsService } from '../uploads.service/uploads.service';
import { NatsService } from '../services/nats.service';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';
import Stream from 'node:stream';
import fs from 'fs';

@Controller()
export class FileController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private uploadsService: UploadsService,
    private natsServices: NatsService,
  ) { }


  @MessagePattern('upload-file')
  async uploadfile(
    @Payload()
    data: {
      originalname: string;
      buffer: string;
      mimetype: string;
      size: number;
      oldfilename: string;
    },
  ) {
    const { oldfilename, buffer, originalname, mimetype } = data;
    const fileBuffer = Buffer.from(buffer);
    this.uploadsService.deleteFile(oldfilename);
    const fileUrl = await this.uploadsService.uploadFile(
      fileBuffer,
      originalname,
      mimetype,
    );
    return { fileUrl }
  }

  @MessagePattern('read-photo-open-download')
  async readphoto(data: { _filename: string, _w: number, _h: number }) {
    const { _w, _h } = data
    const fileBuffer = await this.uploadsService.readPhoto(data);
    if (fileBuffer) {
      return fileBuffer.toString()
    } else {
      throw new RpcException({ statusCode: 404, message: "File Not found!!" })
    }
  }

  // @MessagePattern('read-photo-open-download')
  // async readphoto(data: { _filename: string, _w: number, _h: number }): Promise<any> {
  //   const { _w, _h } = data
  //   const fileBuffer: any = await this.uploadsService.readPhoto(data);
  //   const metadata = await sharp(fileBuffer).metadata();
  //   if (!metadata.format) {
  //     const outputBuffer = sharp(fileBuffer, { failOnError: false })
  //     outputBuffer.resize({
  //       width: _w,
  //       height: _h,
  //       fit: sharp.fit.inside, // maintains aspect ratio
  //       withoutEnlargement: true // won't enlarge if smaller than target
  //     })
  //       .toBuffer((err, buffer)=>{
  //         return buffer
  //       });
  //     return outputBuffer
  //   } else {
  //     throw new RpcException({ statusCode: 404, message: "File Not found!!" })
  //   }
  // }

  @MessagePattern("read-file-open-download")
  async readfile(data: { _filename: string, }) {
    const file = await this.uploadsService.readFile(data);
    if (file) {
      const fileString = file.toString()
      return fileString;
    } else {
      throw new RpcException({ statusCode: 404, message: "File Not found!!" })
    }
  }

  @MessagePattern('delete-file')
  async deletefile(@Payload() data) {
    const { filename } = data;
    return this.uploadsService.deleteFile(filename);
  }
}
