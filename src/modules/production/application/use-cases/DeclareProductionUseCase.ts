import type { LedgerRepository } from "../../../ledger/domain/repositories/LedgerRepository";
import type { WacService } from "../../../ledger/domain/services/WacService";
import type { ProductionRepository } from "../../domain/repositories/ProductionRepository";

export class DeclareProductionUseCase {
  constructor(
    private readonly production: ProductionRepository,
    private readonly ledger: LedgerRepository,
    private readonly wac: WacService,
  ) {}

  async execute(input: { lotId: string; companyId: string; productId: string; producedQuantity: string; unitCost: string }) {
    await this.production.declareProduction(input.lotId, input.producedQuantity, input.unitCost);

    await this.ledger.post({
      companyId: input.companyId,
      inventoryId: input.productId,
      type: "PRODUCTION_IN",
      quantity: input.producedQuantity,
      unitCost: input.unitCost,
      productionLotId: input.lotId,
    });

    await this.wac.applyEntry({ inventoryId: input.productId, quantity: input.producedQuantity, unitCost: input.unitCost });
  }
}
