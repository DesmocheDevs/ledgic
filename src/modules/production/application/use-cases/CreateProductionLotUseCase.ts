import type { ProductionRepository } from "../../domain/repositories/ProductionRepository";
import { inject, injectable } from "tsyringe";
import type { PrismaClient } from "@prisma/client";
import { TOKENS } from "../../../../shared/container";

@injectable()
export class CreateProductionLotUseCase {
  constructor(private readonly repo: ProductionRepository, @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}
  async execute(input: { companyId: string; productId: string; lotCode: string; plannedQuantity: string; startDate?: Date | null }) {
    const { companyId, productId, lotCode, plannedQuantity, startDate } = input;
    // Validar que productId apunte a INVENTORY de tipo PRODUCT y misma empresa
    const inv = await this.prisma.inventory.findUnique({ where: { id: productId }, select: { itemType: true, companyId: true } });
    if (!inv) throw new Error("Product inventory not found");
    if (inv.itemType !== "PRODUCT") throw new Error("productId must reference an Inventory with itemType PRODUCT");
    if (inv.companyId !== companyId) throw new Error("Product belongs to a different company");
    return this.repo.createLot({ companyId, productId, lotCode, plannedQuantity, startDate, endDate: null, unitCost: null, totalCost: null });
  }
}
