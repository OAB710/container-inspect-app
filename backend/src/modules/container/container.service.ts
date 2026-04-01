import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContainerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.container.findMany({
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
      orderBy: {
        id: 'desc',
      },
    });
  }
}
