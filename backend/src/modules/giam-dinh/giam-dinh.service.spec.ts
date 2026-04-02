import { BadRequestException, ConflictException } from '@nestjs/common';
import { GiamDinhService } from './giam-dinh.service';

describe('GiamDinhService', () => {
  const prismaMock = {
    container: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    giamDinh: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  let service: GiamDinhService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GiamDinhService(prismaMock);
  });

  it('should block createInspection when container already has completed inspection', async () => {
    prismaMock.container.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.giamDinh.findFirst.mockResolvedValue({ id: 99 });

    await expect(
      service.createInspection({
        containerId: 1,
        surveyorId: 2,
        inspectionCode: 'GD-TEST-001',
        inspectionDate: '2026-04-02T10:00:00.000Z',
        result: 'ok',
        note: 'note',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prismaMock.giamDinh.create).not.toHaveBeenCalled();
  });

  it('should return conflict on saveDraft when expectedUpdatedAt is stale', async () => {
    const existingUpdatedAt = new Date('2026-04-02T10:00:00.000Z');

    prismaMock.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        giamDinh: {
          findUnique: jest.fn().mockResolvedValue({
            id: 10,
            status: 'draft',
            surveyorId: 1,
            updatedAt: existingUpdatedAt,
          }),
        },
      };
      return cb(tx);
    });

    await expect(
      service.saveDraft(10, {
        id: 10,
        containerId: 1,
        surveyorId: 1,
        inspectionCode: 'GD-TEST-002',
        inspectionDate: '2026-04-02T10:00:00.000Z',
        expectedUpdatedAt: '2026-04-02T09:59:59.000Z',
        result: 'ok',
        note: 'note',
        damages: [],
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should allow completing inspection without note or damages and set container inspected', async () => {
    prismaMock.giamDinh.findUnique.mockResolvedValue({
      id: 20,
      containerId: 3,
      status: 'draft',
      surveyorId: 1,
      updatedAt: new Date('2026-04-02T10:00:00.000Z'),
      result: 'Đạt',
      note: '',
      damages: [],
    });

    prismaMock.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        giamDinh: {
          update: jest.fn().mockResolvedValue({ id: 20 }),
          findUnique: jest
            .fn()
            .mockResolvedValue({ id: 20, status: 'completed' }),
        },
        container: {
          update: jest.fn().mockResolvedValue({ id: 3, status: 'inspected' }),
        },
      };

      const result = await cb(tx);

      expect(tx.container.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: { status: 'inspected' },
      });

      return result;
    });

    await service.completeInspection(20, {});
  });
});
