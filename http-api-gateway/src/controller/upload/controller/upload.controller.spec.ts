import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { NatsService } from '../../../nats-client/nats.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';

describe('UploadController', () => {
  let uploadController: UploadController;
  let natsService: NatsService;

  const mockNatsService = {
    handleNatsEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: NatsService,
          useValue: mockNatsService,
        },
        {
          provide: 'NATS_SERVICE',
          useValue: {}, // Mock ClientProxy if needed
        },
      ],
    }).compile();

    uploadController = module.get<UploadController>(UploadController);
    natsService = module.get<NatsService>(NatsService);
  });

  it('should be defined', () => {
    expect(uploadController).toBeDefined();
  });

  describe('photo', () => {
    it('should send file data to the microservice', async () => {
      const mockFile = {
        originalname: 'test-file.jpg',
        buffer: Buffer.from('test-buffer'),
        mimetype: 'image/jpeg',
        size: 12345,
      } as Express.Multer.File;

      const expectedFileData = {
        originalname: 'test-file.jpg',
        buffer: mockFile.buffer.toString('base64'),
        mimetype: 'image/jpeg',
        size: 12345,
      };

      await uploadController.photo(mockFile);

      expect(natsService.handleNatsEvent).toHaveBeenCalledWith(
        'teacher-upload-photo',
        expectedFileData,
      );
    });

    it('should throw an error if NatsService fails', async () => {
      const mockFile = {
        originalname: 'test-file.jpg',
        buffer: Buffer.from('test-buffer'),
        mimetype: 'image/jpeg',
        size: 12345,
      } as Express.Multer.File;

      mockNatsService.handleNatsEvent.mockImplementation(() => {
        throw new HttpException('NATS error', 500);
      });

      await expect(uploadController.photo(mockFile)).rejects.toThrow(
        'NATS error',
      );
    });
  });
});