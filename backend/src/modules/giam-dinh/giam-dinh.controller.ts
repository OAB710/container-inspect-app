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
  Req,
  UseGuards,
} from '@nestjs/common';
import { GiamDinhService } from './giam-dinh.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { SaveInspectionDto } from './dto/save-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('giam-dinh')
@UseGuards(JwtAuthGuard)
export class GiamDinhController {
  constructor(private readonly giamDinhService: GiamDinhService) {}

  @Post()
  createInspection(@Req() req: any, @Body() body: CreateInspectionDto) {
    return this.giamDinhService.createInspection(body, req.user);
  }

  @Post('save-draft')
  saveDraftNew(@Req() req: any, @Body() body: SaveInspectionDto) {
    return this.giamDinhService.saveDraft(null, body, req.user);
  }

  @Post(':id/save-draft')
  saveDraftExisting(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaveInspectionDto,
  ) {
    return this.giamDinhService.saveDraft(id, body, req.user);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query() query: { status?: string; containerNo?: string },
  ) {
    const { status, containerNo } = query;
    return this.giamDinhService.findAll(status, containerNo, req.user);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.giamDinhService.findOne(id, req.user);
  }

  @Patch(':id')
  updateInspection(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateInspectionDto,
  ) {
    return this.giamDinhService.updateInspection(id, body, req.user);
  }

  @Patch(':id/complete')
  completeInspection(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CompleteInspectionDto,
  ) {
    return this.giamDinhService.completeInspection(id, body, req.user);
  }

  @Delete(':id')
  deleteInspection(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.giamDinhService.deleteInspection(id, req.user);
  }
}
