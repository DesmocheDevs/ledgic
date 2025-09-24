import type { LedgerRepository } from "../../../ledger/domain/repositories/LedgerRepository";
import type { WacService } from "../../../ledger/domain/services/WacService";
import type { PurchaseRepository } from "../../domain/repositories/PurchaseRepository";
import { inject, injectable } from "tsyringe";
import type { PrismaClient } from "@prisma/client";
import { TOKENS } from "../../../../shared/container";

@injectable()
export class CompletePurchaseUseCase {
  constructor(
    private readonly purchases: PurchaseRepository,
    private readonly ledger: LedgerRepository,
    private readonly wac: WacService,
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async execute(purchaseId: string): Promise<void> {
    const purchase = await this.purchases.findById(purchaseId);
    if (!purchase) throw new Error("Purchase not found");
    if (purchase.status !== "PENDING") return;

    // Validar empresa del material y postear asientos
    for (const item of purchase.items) {
      const inv = await this.prisma.inventory.findUnique({ where: { id: item.materialId }, select: { companyId: true } });
      if (!inv) throw new Error("Material inventory not found");
      if (inv.companyId !== purchase.companyId) {
        throw new Error("Material belongs to a different company");
      }
      await this.ledger.post({
        companyId: purchase.companyId,
        inventoryId: item.materialId,
        type: "PURCHASE",
        quantity: item.quantity,
        unitCost: item.unitPrice,
        referenceId: purchase.id,
        purchaseId: purchase.id,
      });
      await this.wac.applyEntry({ inventoryId: item.materialId, quantity: item.quantity, unitCost: item.unitPrice });
    }

    await this.purchases.setStatus(purchase.id, "COMPLETED");
  }
}
