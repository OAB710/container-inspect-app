import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class GiamDinhService {
  constructor(private readonly prisma: PrismaService) {}

  async createInspection(dto: CreateInspectionDto) {
    return this.prisma.giamDinh.create({
      data: {
        containerId: dto.containerId,
        surveyorId: dto.surveyorId,
        inspectionCode: dto.inspectionCode,
        inspectionDate: new Date(dto.inspectionDate),
        status: 'draft',
        result: dto.result,
        note: dto.note,
      },
      include: {
        container: true,
        surveyor: true,
      },
    });
  }

  async findAll(status?: string, containerNo?: string) {
    return this.prisma.giamDinh.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(containerNo
          ? {
              container: {
                containerNo: {
                  contains: containerNo,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
      },
      include: {
        container: true,
        surveyor: true,
        damages: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const inspection = await this.prisma.giamDinh.findUnique({
      where: { id },
      include: {
        container: true,
        surveyor: true,
        damages: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!inspection) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    return inspection;
  }

  async updateInspection(id: number, dto: UpdateInspectionDto) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    if (existing.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã completed, không được phép chỉnh sửa',
      );
    }

    return this.prisma.giamDinh.update({
      where: { id },
      data: {
        containerId: dto.containerId,
        surveyorId: dto.surveyorId,
        inspectionCode: dto.inspectionCode,
        inspectionDate: new Date(dto.inspectionDate),
        result: dto.result,
        note: dto.note,
      },
      include: {
        container: true,
        surveyor: true,
        damages: {
          include: {
            images: true,
          },
        },
      },
    });
  }

  async completeInspection(id: number) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    if (existing.status === 'completed') {
      throw new BadRequestException('Giám định này đã completed rồi');
    }

    return this.prisma.giamDinh.update({
      where: { id },
      data: {
        status: 'completed',
      },
    });
  }

  async deleteInspection(id: number) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    if (existing.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã completed, không được phép xóa',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.huHongImage.deleteMany({
        where: {
          huHong: {
            giamDinhId: id,
          },
        },
      });

      await tx.huHong.deleteMany({
        where: {
          giamDinhId: id,
        },
      });

      await tx.giamDinh.delete({
        where: { id },
      });
    });

    return {
      message: 'Xóa giám định thành công',
    };
  }
}