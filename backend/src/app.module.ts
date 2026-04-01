import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GiamDinhModule } from './modules/giam-dinh/giam-dinh.module';
import { DamagesModule } from './modules/damages/damages.module';
import { ImagesModule } from './modules/images/images.module';
import { ContainerModule } from './modules/container/container.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    GiamDinhModule,
    DamagesModule,
    ImagesModule,
    ContainerModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}