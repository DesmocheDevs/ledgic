import { Prisma, type PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";
import type { LedgerRepository, PostTransactionInput } from "../../domain/repositories/LedgerRepository";

@injectable()
export class PrismaLedgerRepository implements LedgerRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async post(input: PostTransactionInput): Promise<void> {
    await this.prisma.inventoryTransaction.create({
      data: {
        companyId: input.companyId,
        inventoryId: input.inventoryId,
        type: input.type,
  quantity: new Prisma.Decimal(input.type === "CONSUMPTION" ? (new Prisma.Decimal(input.quantity).neg().toString()) : input.quantity),
  unitCost: new Prisma.Decimal(input.unitCost),
  totalCost: new Prisma.Decimal(new Prisma.Decimal(input.quantity).mul(input.unitCost)),
        referenceId: input.referenceId ?? null,
        purchaseId: input.purchaseId ?? null,
        productionLotId: input.productionLotId ?? null,
      },
    });
  }
}
