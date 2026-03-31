import { Module } from '@nestjs/common';
import { GiamDinhController } from './giam-dinh.controller';
import { GiamDinhService } from './giam-dinh.service';

@Module({
  controllers: [GiamDinhController],
  providers: [GiamDinhService],
})
export class GiamDinhModule {}