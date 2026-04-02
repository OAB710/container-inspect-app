import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDamageDto } from './dto/create-damage.dto';
import { UpdateDamageDto } from './dto/update-damage.dto';

@Injectable()
export class DamagesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureInspectionEditable(inspectionId: number) {
    const inspection = await this.prisma.giamDinh.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    if (inspection.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã hoàn tất, không được phép chỉnh sửa',
      );
    }

    return inspection;
  }

  async createDamage(inspectionId: number, dto: CreateDamageDto) {
    await this.ensureInspectionEditable(inspectionId);

    return this.prisma.huHong.create({
      data: {
        giamDinhId: inspectionId,
        damageType: dto.damageType,
        severity: dto.severity,
        damagePosition: dto.damagePosition,
        description: dto.description,
        repairMethod: dto.repairMethod,
      },
      include: {
        images: true,
      },
    });
  }

  async updateDamage(damageId: number, dto: UpdateDamageDto) {
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
        'Giám định đã hoàn tất, không được phép chỉnh sửa',
      );
    }

    return this.prisma.huHong.update({
      where: { id: damageId },
      data: {
        damageType: dto.damageType,
        severity: dto.severity,
        damagePosition: dto.damagePosition,
        description: dto.description,
        repairMethod: dto.repairMethod,
      },
      include: {
        images: true,
      },
    });
  }

  async deleteDamage(damageId: number) {
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
        'Giám định đã hoàn tất, không được phép xóa',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.huHongImage.deleteMany({
        where: { huHongId: damageId },
      });

      await tx.huHong.delete({
        where: { id: damageId },
      });
    });

    return { message: 'Xóa hư hỏng thành công' };
  }
}
