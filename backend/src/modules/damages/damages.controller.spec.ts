import { Test, TestingModule } from '@nestjs/testing';
import { DamagesController } from './damages.controller';

describe('DamagesController', () => {
  let controller: DamagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DamagesController],
    }).compile();

    controller = module.get<DamagesController>(DamagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
