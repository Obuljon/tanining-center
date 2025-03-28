import { Test, TestingModule } from '@nestjs/testing';
import { MainCrudController } from './main_crud.controller';

describe('MainCrudController', () => {
  let controller: MainCrudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainCrudController],
    }).compile();

    controller = module.get<MainCrudController>(MainCrudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
