import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DamagesService } from './damages.service';
import { CreateDamageDto } from './dto/create-damage.dto';
import { UpdateDamageDto } from './dto/update-damage.dto';

@Controller()
export class DamagesController {
  constructor(private readonly damagesService: DamagesService) {}

  @Post('giam-dinh/:id/damages')
  createDamage(
    @Param('id', ParseIntPipe) inspectionId: number,
    @Body() body: CreateDamageDto,
  ) {
    return this.damagesService.createDamage(inspectionId, body);
  }

  @Patch('damages/:damageId')
  updateDamage(
    @Param('damageId', ParseIntPipe) damageId: number,
    @Body() body: UpdateDamageDto,
  ) {
    return this.damagesService.updateDamage(damageId, body);
  }

  @Delete('damages/:damageId')
  deleteDamage(@Param('damageId', ParseIntPipe) damageId: number) {
    return this.damagesService.deleteDamage(damageId);
  }
}