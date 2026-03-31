import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GiamDinhModule } from './modules/giam-dinh/giam-dinh.module';
import { DamagesModule } from './modules/damages/damages.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    GiamDinhModule,
    DamagesModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}