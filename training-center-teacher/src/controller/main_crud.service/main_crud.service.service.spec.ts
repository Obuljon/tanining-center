import { Test, TestingModule } from '@nestjs/testing';
import { MainCrudServiceService } from './main_crud.service.service';

describe('MainCrudServiceService', () => {
  let service: MainCrudServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainCrudServiceService],
    }).compile();

    service = module.get<MainCrudServiceService>(MainCrudServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
