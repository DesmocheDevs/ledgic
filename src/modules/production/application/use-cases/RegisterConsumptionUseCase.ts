import type { LedgerRepository } from "../../../ledger/domain/repositories/LedgerRepository";
import type { WacService } from "../../../ledger/domain/services/WacService";
import type { ProductionRepository } from "../../domain/repositories/ProductionRepository";

export class RegisterConsumptionUseCase {
  constructor(
    private readonly production: ProductionRepository,
    private readonly ledger: LedgerRepository,
    private readonly wac: WacService,
  ) {}

  async execute(input: { lotId: string; materialId: string; companyId: string; quantity: string; unitCostAtConsumption?: string }) {
    // Persist domain record
    const unitCost = input.unitCostAtConsumption ?? (await this.getCurrentWac(input.materialId));
    const consumption = await this.production.addConsumption(input.lotId, input.materialId, input.quantity, unitCost);

    // Post ledger outflow (negative)
    await this.ledger.post({
      companyId: input.companyId,
      inventoryId: input.materialId,
      type: "CONSUMPTION",
      quantity: input.quantity,
      unitCost: unitCost,
      referenceId: consumption.id,
      productionLotId: input.lotId,
    });

    await this.wac.applyConsumption({ inventoryId: input.materialId, quantity: input.quantity });
  }

  private async getCurrentWac(inventoryId: string): Promise<string> {
    void inventoryId; // placeholder: consulta de WAC actual
    // En esta versión simple asumimos que el caso de uso recibe el unitCost o se puede mejorar consultando Inventory.
    return "0";
  }
}
