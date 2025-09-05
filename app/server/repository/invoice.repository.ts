import { ConflictError, InvoiceNotFoundError } from "@/app/data/error";
import { ListInvoicesFilter } from "@/app/data/types";
import { Invoice, Prisma } from "@/lib/generated/prisma";

export class InvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Normaliza valores monetários/token para DECIMAL(30,6) com arredondamento seguro.
   */
  private toMoneyDecimal(value: number | string): Prisma.Decimal {
    const d = new Prisma.Decimal(value);
    // Garante 6 casas (USDC/USDT) e arredonda HALF_UP
    return new Prisma.Decimal(d.toFixed(6, Prisma.Decimal.ROUND_HALF_UP));
  }

  /**
   * Cria uma invoice em estado CREATED com janela de validade.
   */
  async create(dto: CreateInvoiceDTO): Promise<Invoice> {
    const now = new Date();
    const validFor = dto.validForSeconds ?? 600;
    const validUntil = new Date(now.getTime() + validFor * 1000);

    return this.prisma.invoice.create({
      data: {
        createdById: dto.createdById,
        merchantId: dto.merchantId,
        amount: this.toMoneyDecimal(dto.amount),
        stablecoin: dto.stablecoin,
        destination: dto.destination,
        status: 'CREATED',
        validUntil,
        memo: dto.memo ?? null,
      },
    });
  }

  /**
   * Busca por id. Lança NotFoundError se não existir.
   */
  async getByIdOrThrow(id: string): Promise<Invoice> {
    const inv = await this.prisma.invoice.findUnique({ where: { id } });
    if (!inv) throw new InvoiceNotFoundError();
    return inv;
  }

  async listByMerchant({
    merchantId: merchantId,
    status,
    take = 20,
    cursor,
  }: ListInvoicesFilter): Promise<{ items: Invoice[]; nextCursor: string | null }> {
    const where: Prisma.InvoiceWhereInput = {
      merchantId: merchantId,
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.invoice.findMany({
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
   * Expira uma invoice (uso em flows manuais).
   * Se já estiver CONFIRMED/CANCELLED/EXPIRED, lança ConflictError.
   */
  async updateToExpired(id: string): Promise<Invoice> {
    // Update condicional com updateMany para evitar race condition.
    const res = await this.prisma.invoice.updateMany({
      where: { id, status: { in: ['CREATED'] } },
      data: { status: 'EXPIRED' },
    });

    if (res.count === 0) {
      const current = await this.prisma.invoice.findUnique({ where: { id } });
      if (!current) throw new InvoiceNotFoundError();
      throw new ConflictError(`Cannot expire invoice with status ${current.status}`);
    }

    return this.getByIdOrThrow(id);
  }

  /**
   * Marca uma invoice como CONFIRMED registrando assinatura/payer vencedores.
   * - Usa updateMany condicional para garantir que só sai de CREATED -> CONFIRMED.
   * - Retorna a invoice final.
   */
  async confirm(
    invoiceId: string,
    signature: string,
    payer?: string | null,
  ): Promise<Invoice> {
    const res = await this.prisma.invoice.updateMany({
      where: { id: invoiceId, status: 'CREATED' },
      data: {
        status: 'CONFIRMED',
        signature,
        payer: payer ?? null,
      },
    });

    if (res.count === 0) {
      const cur = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
      if (!cur) throw new InvoiceNotFoundError();
      // Se já confirmarou, podemos retornar como sucesso idempotente:
      if (cur.status === 'CONFIRMED' && cur.signature === signature) return cur;
      throw new ConflictError(`Invoice cannot be confirmed from status ${cur.status}`);
    }

    return this.getByIdOrThrow(invoiceId);
  }

  async cancel(id: string): Promise<Invoice> {
    const res = await this.prisma.invoice.updateMany({
      where: { id, status: 'CREATED' },
      data: { status: 'CANCELLED' },
    });

    if (res.count === 0) {
      const cur = await this.prisma.invoice.findUnique({ where: { id } });
      if (!cur) throw new InvoiceNotFoundError();
      throw new ConflictError(`Cannot cancel invoice with status ${cur.status}`);
    }
    
    return this.getByIdOrThrow(id);
  }

  /**
   * Expiração em lote para jobs (respeita @@index([status, validUntil])).
   * Retorna quantidade atualizada.
   */
  async expireStale(now: Date = new Date()): Promise<number> {
    const res = await this.prisma.invoice.updateMany({
      where: {
        status: { in: ['CREATED'] },
        validUntil: { lt: now },
      },
      data: { status: 'EXPIRED' },
    });
    return res.count;
  }
}