import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { SaveInspectionDto } from './dto/save-inspection.dto';

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

  async saveDraft(id: number | null, dto: SaveInspectionDto) {
    return this.prisma.$transaction(async (tx) => {
      let inspection;

      if (id) {
        // Update existing inspection
        const existing = await tx.giamDinh.findUnique({
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

        inspection = await tx.giamDinh.update({
          where: { id },
          data: {
            containerId: dto.containerId,
            surveyorId: dto.surveyorId,
            inspectionCode: dto.inspectionCode,
            inspectionDate: new Date(dto.inspectionDate),
            result: dto.result,
            note: dto.note,
          },
        });

        // Delete all existing damages for this inspection
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
      } else {
        // Create new inspection
        inspection = await tx.giamDinh.create({
          data: {
            containerId: dto.containerId,
            surveyorId: dto.surveyorId,
            inspectionCode: dto.inspectionCode,
            inspectionDate: new Date(dto.inspectionDate),
            status: 'draft',
            result: dto.result,
            note: dto.note,
          },
        });
      }

      // Create damages and their images
      for (const damageDto of dto.damages) {
        const damage = await tx.huHong.create({
          data: {
            giamDinhId: inspection.id,
            damageType: damageDto.damageType,
            severity: damageDto.severity,
            damagePosition: damageDto.damagePosition,
            description: damageDto.description,
            repairMethod: damageDto.repairMethod,
          },
        });

        // Create images for this damage
        for (const imageUrl of damageDto.images) {
          if (imageUrl) {
            await tx.huHongImage.create({
              data: {
                huHongId: damage.id,
                imageUrl,
                imageName: imageUrl.split('/').pop() || imageUrl,
              },
            });
          }
        }
      }

      // Return complete inspection with all related data
      return tx.giamDinh.findUnique({
        where: { id: inspection.id },
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
    });
  }

  async completeInspection(id: number) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
      include: {
        damages: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    if (existing.status === 'completed') {
      throw new BadRequestException('Giám định này đã completed rồi');
    }

    // Validate required fields
    if (!existing.result || !existing.note) {
      throw new BadRequestException(
        'Vui lòng điền đầy đủ kết quả giám định và ghi chú trước khi hoàn tất',
      );
    }

    if (!existing.damages || existing.damages.length === 0) {
      throw new BadRequestException(
        'Vui lòng thêm ít nhất một hư hỏng trước khi hoàn tất',
      );
    }

    return this.prisma.giamDinh.update({
      where: { id },
      data: {
        status: 'completed',
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
