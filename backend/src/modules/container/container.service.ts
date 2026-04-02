import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContainerService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeSelectableStatus(status: string) {
    const normalized = status.trim().toLowerCase();

    if (['available', 'inspection_pending', 'in_use'].includes(normalized)) {
      return 'empty';
    }

    return normalized;
  }

  async findAll(search?: string) {
    const containers = await this.prisma.container.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  containerNo: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  containerType: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        inspections: {
          where: {
            status: 'completed',
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return containers.map((container) => {
      const inspected = container.inspections.length > 0;

      return {
        id: container.id,
        containerNo: container.containerNo,
        containerType: container.containerType,
        containerSize: container.containerSize,
        status: inspected
          ? 'inspected'
          : this.normalizeSelectableStatus(container.status),
      };
    });
  }
}
