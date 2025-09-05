import { Prisma, type PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";
import type { BomRepository } from "../../domain/repositories/BomRepository";
import type { BomItem } from "../../domain/entities/Bom";

@injectable()
export class PrismaBomRepository implements BomRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async list(productId: string): Promise<BomItem[]> {
    const rows = await this.prisma.productMaterial.findMany({ where: { productId } });
  return rows.map(r => ({ productId: r.productId, materialId: r.materialId, quantity: r.quantity.toString(), unitOfMeasure: r.unitOfMeasure ?? null }));
  }

  async upsert(productId: string, items: BomItem[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.productMaterial.deleteMany({ where: { productId } });
      if (items.length === 0) return;
      await tx.productMaterial.createMany({
        data: items.map(i => ({ productId, materialId: i.materialId, quantity: new Prisma.Decimal(i.quantity), unitOfMeasure: i.unitOfMeasure ?? null })),
        skipDuplicates: true,
      });
    });
  }
}
