import { Controller, Get, Query } from '@nestjs/common';
import { ContainerService } from './container.service';

@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.containerService.findAll(search);
  }
}
