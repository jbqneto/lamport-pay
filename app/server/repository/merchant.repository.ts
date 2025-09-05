import { CreateMerchantDTO, UpdateMerchantDTO } from "@/app/data/dto";
import { ConflictError, MerchantNotFoundError } from "@/app/data/error";
import { ListMerchantsFilter } from "@/app/data/types";
import { Merchant } from "@/lib/generated/prisma";
import { PrismaClient } from "@prisma/client";

export class MerchantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new merchant.
   */
  async create(dto: CreateMerchantDTO): Promise<Merchant> {
    if (!dto.name?.trim()) {
      throw new ConflictError('Merchant name is required');
    }

    return this.prisma.merchant.create({
      data: {
        ownerId: dto.ownerId,
        name: dto.name.trim(),
        
        status: 'active',
      },
    });
  }

  /**
   * Get by id or throw NotFoundError.
   */
  async getByIdOrThrow(id: string): Promise<Merchant> {
    const m = await this.prisma.merchant.findUnique({ where: { id } });
    if (!m) throw new MerchantNotFoundError();
    return m;
  }

  /**
   * List merchants by owner with cursor pagination.
   * (Aligned with suggested @@index on ownerId, status, createdAt if you add it)
   */
  async listByOwner({
    ownerId,
    status,
    take = 20,
    cursor,
  }: ListMerchantsFilter): Promise<{ items: Merchant[]; nextCursor: string | null }> {
    const where = {
      ownerId,
      ...(status ? { status } as const : {}),
    };

    const items = await this.prisma.merchant.findMany({
      where,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });

    const hasMore = items.length > take;
    const data = hasMore ? items.slice(0, -1) : items;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return { items: data, nextCursor };
  }

  /**
   * Partially update merchant (name, token accounts, status).
   */
  async update(id: string, patch: UpdateMerchantDTO): Promise<Merchant> {
    // Normalize
    const data: Partial<Merchant> = {};
    if (typeof patch.name === 'string') data.name = patch.name.trim();
    if (patch.status) data.status = patch.status;

    const m = await this.prisma.merchant.update({
      where: { id },
      data,
    });

    return m;
  }

  /**
   * Enable merchant (idempotent).
   */
  async activate(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  /**
   * Disable merchant (idempotent).
   */
  async disable(id: string): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: { status: 'disabled' },
    });
  }

}