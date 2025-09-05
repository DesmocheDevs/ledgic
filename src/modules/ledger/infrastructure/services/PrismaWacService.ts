import { Prisma, type PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";
import type { ApplyConsumptionInput, ApplyEntryInput, WacService } from "../../domain/services/WacService";

@injectable()
export class PrismaWacService implements WacService {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async applyEntry(input: ApplyEntryInput): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.findUnique({ where: { id: input.inventoryId } });
      if (!inv) throw new Error("Inventory not found");
    const qty = new Prisma.Decimal(input.quantity);
    const unit = new Prisma.Decimal(input.unitCost);
    const currentQty = new Prisma.Decimal(inv.currentQuantity);
    const currentValue = new Prisma.Decimal(inv.totalInventoryValue ?? 0);
    const newQty = currentQty.add(qty);
    const addValue = qty.mul(unit);
    const newValue = currentValue.add(addValue);
    const newWac = newQty.gt(0) ? newValue.div(newQty) : new Prisma.Decimal(0);
      await tx.inventory.update({
        where: { id: input.inventoryId },
        data: {
      currentQuantity: newQty,
      totalInventoryValue: newValue,
      weightedAverageCost: newWac,
        },
      });
    });
  }

  async applyConsumption(input: ApplyConsumptionInput): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.findUnique({ where: { id: input.inventoryId } });
      if (!inv) throw new Error("Inventory not found");
    const qty = new Prisma.Decimal(input.quantity);
    const currentQty = new Prisma.Decimal(inv.currentQuantity);
    const wac = new Prisma.Decimal(inv.weightedAverageCost ?? 0);
    const newQty = currentQty.sub(qty);
    const newValue = newQty.mul(wac);
      await tx.inventory.update({
        where: { id: input.inventoryId },
        data: {
      currentQuantity: newQty,
      totalInventoryValue: newValue,
        },
      });
    });
  }
}
