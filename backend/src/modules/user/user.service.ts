import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByExactUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: 'insensitive',
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive',
        },
      },
    });
  }

  async createUser(input: {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role: string;
  }) {
    return this.prisma.user.create({
      data: {
        username: input.username,
        password: input.password,
        fullName: input.fullName,
        email: input.email,
        role: input.role,
      },
    });
  }

  async findByUsername(username: string) {
    const normalized = username.trim();

    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: normalized,
              mode: 'insensitive',
            },
          },
          {
            email: {
              equals: normalized,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findSurveyors(
    search?: string,
    currentUser?: { id: number; role?: string },
  ) {
    if (currentUser?.role !== 'admin' && currentUser?.id) {
      const user = await this.prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      });

      return user ? [user] : [];
    }

    return this.prisma.user.findMany({
      where: {
        role: 'surveyor',
        ...(search
          ? {
              OR: [
                {
                  fullName: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }
}
