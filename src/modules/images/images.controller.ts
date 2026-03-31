import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('damages/:damageId/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadDamageImage(
    @Param('damageId', ParseIntPipe) damageId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.uploadDamageImage(damageId, file);
  }

  @Delete('images/:imageId')
  deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.imagesService.deleteImage(imageId);
  }
}