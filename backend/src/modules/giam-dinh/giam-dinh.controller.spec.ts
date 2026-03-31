import { Test, TestingModule } from '@nestjs/testing';
import { GiamDinhController } from './giam-dinh.controller';

describe('GiamDinhController', () => {
  let controller: GiamDinhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiamDinhController],
    }).compile();

    controller = module.get<GiamDinhController>(GiamDinhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
