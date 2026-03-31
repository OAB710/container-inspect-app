import { Test, TestingModule } from '@nestjs/testing';
import { DamagesService } from './damages.service';

describe('DamagesService', () => {
  let service: DamagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DamagesService],
    }).compile();

    service = module.get<DamagesService>(DamagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
