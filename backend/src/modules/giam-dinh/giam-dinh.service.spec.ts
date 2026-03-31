import { Test, TestingModule } from '@nestjs/testing';
import { GiamDinhService } from './giam-dinh.service';

describe('GiamDinhService', () => {
  let service: GiamDinhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiamDinhService],
    }).compile();

    service = module.get<GiamDinhService>(GiamDinhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
