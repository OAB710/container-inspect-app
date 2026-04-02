import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Thiếu file upload');
    }

    console.log('📥 [Controller] POST /images/upload received:', {
      fileName: file.originalname,
      fileSize: file.size,
    });

    return this.imagesService.uploadToCloudinary(file);
  }

  @Delete(':imageId')
  async deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.imagesService.deleteImage(imageId);
  }
}
