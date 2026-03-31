import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GiamDinhService } from './giam-dinh.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Controller('giam-dinh')
export class GiamDinhController {
  constructor(private readonly giamDinhService: GiamDinhService) {}

  @Post()
  createInspection(@Body() body: CreateInspectionDto) {
    return this.giamDinhService.createInspection(body);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('containerNo') containerNo?: string,
  ) {
    return this.giamDinhService.findAll(status, containerNo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.giamDinhService.findOne(id);
  }

  @Patch(':id')
  updateInspection(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateInspectionDto,
  ) {
    return this.giamDinhService.updateInspection(id, body);
  }

  @Patch(':id/complete')
  completeInspection(@Param('id', ParseIntPipe) id: number) {
    return this.giamDinhService.completeInspection(id);
  }

  @Delete(':id')
  deleteInspection(@Param('id', ParseIntPipe) id: number) {
    return this.giamDinhService.deleteInspection(id);
  }
}