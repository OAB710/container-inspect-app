import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { SaveInspectionDto } from './dto/save-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';

@Injectable()
export class GiamDinhService {
  constructor(private readonly prisma: PrismaService) {}

  private isAdmin(currentUser?: { role?: string }) {
    return currentUser?.role === 'admin';
  }

  private assertInspectionAccess(
    inspection: { surveyorId: number },
    currentUser?: { id: number; role?: string },
  ) {
    if (!currentUser || this.isAdmin(currentUser)) {
      return;
    }

    if (inspection.surveyorId !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền truy cập giám định này');
    }
  }

  private async assertContainerCanBeInspected(
    containerId: number,
    excludeInspectionId?: number,
  ) {
    const container = await this.prisma.container.findUnique({
      where: { id: containerId },
      select: { id: true },
    });

    if (!container) {
      throw new NotFoundException('Không tìm thấy container');
    }

    const completedInspection = await this.prisma.giamDinh.findFirst({
      where: {
        containerId,
        status: 'completed',
        ...(excludeInspectionId ? { id: { not: excludeInspectionId } } : {}),
      },
      select: { id: true },
    });

    if (completedInspection) {
      throw new BadRequestException(
        'Container này đã được giám định hoàn tất, không thể chỉnh sửa thêm',
      );
    }
  }

  private assertNotStaleUpdate(
    expectedUpdatedAt: string | undefined,
    actualUpdatedAt: Date,
  ) {
    if (!expectedUpdatedAt) {
      return;
    }

    const expectedMs = new Date(expectedUpdatedAt).getTime();
    if (Number.isNaN(expectedMs)) {
      throw new BadRequestException('expectedUpdatedAt không hợp lệ');
    }

    if (expectedMs !== actualUpdatedAt.getTime()) {
      throw new ConflictException({
        code: 'INSPECTION_STALE',
        message:
          'Dữ liệu giám định đã được cập nhật từ server. Vui lòng làm mới và thử lại.',
      });
    }
  }

  async createInspection(
    dto: CreateInspectionDto,
    currentUser?: { id: number; role?: string },
  ) {
    await this.assertContainerCanBeInspected(dto.containerId);

    const surveyorId = this.isAdmin(currentUser)
      ? dto.surveyorId
      : currentUser?.id || dto.surveyorId;

    return this.prisma.giamDinh.create({
      data: {
        containerId: dto.containerId,
        surveyorId,
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

  async findAll(
    status?: string,
    containerNo?: string,
    currentUser?: { id: number; role?: string },
  ) {
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
        ...(!this.isAdmin(currentUser) && currentUser?.id
          ? { surveyorId: currentUser.id }
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

  async findOne(id: number, currentUser?: { id: number; role?: string }) {
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

    this.assertInspectionAccess(inspection, currentUser);

    return inspection;
  }

  async updateInspection(
    id: number,
    dto: UpdateInspectionDto,
    currentUser?: { id: number; role?: string },
  ) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    this.assertInspectionAccess(existing, currentUser);

    if (existing.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã hoàn tất, không được phép chỉnh sửa',
      );
    }

    await this.assertContainerCanBeInspected(dto.containerId, existing.id);

    return this.prisma.giamDinh.update({
      where: { id },
      data: {
        containerId: dto.containerId,
        surveyorId: this.isAdmin(currentUser)
          ? dto.surveyorId
          : currentUser?.id || dto.surveyorId,
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

  async saveDraft(
    id: number | null,
    dto: SaveInspectionDto,
    currentUser?: { id: number; role?: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      let inspection;
      const surveyorId = this.isAdmin(currentUser)
        ? dto.surveyorId
        : currentUser?.id || dto.surveyorId;

      if (id) {
        // Update existing inspection
        const existing = await tx.giamDinh.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new NotFoundException('Không tìm thấy giám định');
        }

        this.assertInspectionAccess(existing, currentUser);

        if (existing.status === 'completed') {
          throw new BadRequestException(
            'Giám định đã hoàn tất, không được phép chỉnh sửa',
          );
        }

        this.assertNotStaleUpdate(dto.expectedUpdatedAt, existing.updatedAt);

        const containerCompletedByOthers = await tx.giamDinh.findFirst({
          where: {
            containerId: dto.containerId,
            status: 'completed',
            id: { not: id },
          },
          select: { id: true },
        });

        if (containerCompletedByOthers) {
          throw new BadRequestException(
            'Container này đã được giám định hoàn tất, không thể chỉnh sửa thêm',
          );
        }

        inspection = await tx.giamDinh.update({
          where: { id },
          data: {
            containerId: dto.containerId,
            surveyorId,
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
        const containerCompleted = await tx.giamDinh.findFirst({
          where: {
            containerId: dto.containerId,
            status: 'completed',
          },
          select: { id: true },
        });

        if (containerCompleted) {
          throw new BadRequestException(
            'Container này đã được giám định hoàn tất, không thể tạo giám định mới',
          );
        }

        inspection = await tx.giamDinh.create({
          data: {
            containerId: dto.containerId,
            surveyorId,
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

  async completeInspection(
    id: number,
    dto: CompleteInspectionDto,
    currentUser?: { id: number; role?: string },
  ) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
      include: {
        damages: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    this.assertInspectionAccess(existing, currentUser);
    this.assertNotStaleUpdate(dto.expectedUpdatedAt, existing.updatedAt);

    if (existing.status === 'completed') {
      throw new BadRequestException('Giám định này đã hoàn tất rồi');
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

    return this.prisma.$transaction(async (tx) => {
      const completedInspection = await tx.giamDinh.update({
        where: { id },
        data: {
          status: 'completed',
        },
      });

      await tx.container.update({
        where: { id: existing.containerId },
        data: {
          status: 'inspected',
        },
      });

      return tx.giamDinh.findUnique({
        where: { id: completedInspection.id },
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

  async deleteInspection(
    id: number,
    currentUser?: { id: number; role?: string },
  ) {
    const existing = await this.prisma.giamDinh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy giám định');
    }

    this.assertInspectionAccess(existing, currentUser);

    if (existing.status === 'completed') {
      throw new BadRequestException(
        'Giám định đã hoàn tất, không được phép xóa',
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
