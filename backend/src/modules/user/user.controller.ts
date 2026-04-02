import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('surveyors')
  findSurveyors(@Req() req: any, @Query('search') search?: string) {
    return this.userService.findSurveyors(search, req.user);
  }
}
