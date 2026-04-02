import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ContainerService } from './container.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('container')
@UseGuards(JwtAuthGuard)
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.containerService.findAll(search);
  }
}
