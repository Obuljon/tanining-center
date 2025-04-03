import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { GridFSBucket, MongoClient } from 'mongodb';
import { Connection } from 'mongoose';
import sharp from 'sharp';


@Injectable()
export class UploadsService {
  private gridFSBucket: GridFSBucket;
  private client = new MongoClient(
    'mongodb://root:training-center@mongodb:27017',
  );

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.client.connect();
    this.gridFSBucket = new GridFSBucket(this.client.db('uploads'), {
      bucketName: 'uploads',
    });
  }

  async uploadFile(fileBuffer, filename: string, mimetype: string,) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = this.gridFSBucket.openUploadStream(filename, {
          contentType: mimetype,
        });
        uploadStream.write(fileBuffer);
        uploadStream.end();

        uploadStream.on('finish', () => {
          resolve(uploadStream.id.toString());
        });

        uploadStream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    let file = await this.searchfile(filename)
    if (file) {
      await this.gridFSBucket.delete(file._id);
    }
  }

  async readPhoto(data: { _filename: string, _w: number, _h: number }): Promise<Buffer | void> {
    const { _filename, _w, _h } = data;
    const file = await this.searchfile(_filename)
    if (file && file.filename == _filename) {
      try {
        return this.downloadStreamByName(_filename)
      } catch (error) {
        throw new Error(`File read failed: ${error.message}`);
      }
    }
  }

  async readFile(data: { _filename: string }): Promise<Buffer | void> {
    const { _filename } = data
    const file = await this.searchfile(_filename)
    if (file && file.filename == _filename) {
      console.log(file)
      try {
        return this.downloadStreamByid(file._id)
      } catch (error) {
        throw new Error(`File read failed: ${error.message}`);
      }
    }
    return
  }

  async searchfile(name: string): Promise<any | null> {
    const files = await this.gridFSBucket.find({}).toArray();
    for await (const doc of files) {
      if (doc.filename == name) {
        return doc
      }
    }
    return null
  }

  async downloadStreamByName(_filename: string): Promise<Buffer | void> {
    const chunks: Buffer[] = [];
    const downloadStream = this.gridFSBucket.openDownloadStreamByName(_filename)
    return new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        if (!chunk) {
          reject(new Error('Received undefined chunk while reading file'));
        }
        chunks.push(chunk);
      })
        .on('end', () => {
          resolve(Buffer.concat(chunks));
        })
        .on('error', (error) => {
          reject(new Error(`File read failed: ${error.message}`));
        });
    });
  }


  async downloadStreamByid(_id): Promise<Buffer | void> {
    const chunks: Buffer[] = [];
    const downloadStream = this.gridFSBucket.openDownloadStream(_id)
    return new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk) => {
        if (!chunk) {
          reject(new Error('Received undefined chunk while reading file'));
        }
        chunks.push(chunk);
      })
        .on('end', () => {
          resolve(Buffer.concat(chunks));
        })
        .on('error', (error) => {
          reject(new Error(`File read failed: ${error.message}`));
        });
    });
  }

  // openDownloadStream
}
