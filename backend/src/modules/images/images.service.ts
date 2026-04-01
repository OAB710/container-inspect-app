import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Upload file directly to Cloudinary
   * Called from POST /images/upload endpoint
   */
  async uploadToCloudinary(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Thiếu file upload');
    }

    try {
      console.log('📸 [Images] Received file upload request:', {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      const uploaded = await this.cloudinaryService.uploadFile(
        file,
        'container-inspection',
      );

      console.log('📸 [Images] Upload successful:', uploaded.secure_url);

      return {
        image_url: uploaded.secure_url,
        image_name: file.originalname,
      };
    } catch (error: any) {
      console.error('❌ [Images] Upload error:', error);
      throw new BadRequestException(`Lỗi upload ảnh: ${error.message}`);
    }
  }

  async uploadDamageImage(damageId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Thiếu file upload');
    }

    const damage = await this.prisma.huHong.findUnique({
      where: { id: damageId },
      include: {
        giamDinh: true,
      },
    });

    if (!damage) {
      throw new NotFoundException('Không tìm thấy hư hỏng');
    }

    if (damage.giamDinh.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã completed, không được phép thêm ảnh',
      );
    }

    const uploaded = await this.cloudinaryService.uploadFile(
      file,
      'container-damages',
    );

    return this.prisma.huHongImage.create({
      data: {
        huHongId: damageId,
        imageUrl: uploaded.secure_url,
        imageName: file.originalname,
        sortOrder: 0,
      },
    });
  }

  async deleteImage(imageId: number) {
    const image = await this.prisma.huHongImage.findUnique({
      where: { id: imageId },
      include: {
        huHong: {
          include: {
            giamDinh: true,
          },
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Không tìm thấy ảnh');
    }

    if (image.huHong.giamDinh.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã completed, không được phép xóa ảnh',
      );
    }

    await this.prisma.huHongImage.delete({
      where: { id: imageId },
    });

    return { message: 'Xóa ảnh thành công' };
  }
}