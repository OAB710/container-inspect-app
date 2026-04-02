import { Module } from '@nestjs/common';
import { DamagesController } from './damages.controller';
import { DamagesService } from './damages.service';

@Module({
  controllers: [DamagesController],
  providers: [DamagesService],
})
export class DamagesModule {}
