import type { LotRepository } from "../../domain/repositories/LotRepository";
import type { InventoryRepository } from "../../../inventory/domain/repositories/InventoryRepository";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

export interface FinishLotInput {
  producedQuantity: string;
  extraCosts?: {
    labor?: string;
    machine?: string;
    overhead?: string;
    other?: string;
  };
}

export interface FinishLotOutput {
  unitCost: string;
  totalCost: string;
  producedQuantity: string;
}

export class FinishLotUseCase {
  constructor(
    private readonly lotRepo: LotRepository,
    private readonly inventoryRepo: InventoryRepository,
  ) {}

  async execute(lotId: string, input: FinishLotInput): Promise<FinishLotOutput> {
    // Validar entrada
    const producedQty = parseFloat(input.producedQuantity);
    if (isNaN(producedQty) || producedQty <= 0) {
      throw new DomainError("Cantidad producida inválida");
    }

    // Obtener lote
    const lot = await this.lotRepo.findById(lotId);
    if (!lot) {
      throw new DomainError("Lote no encontrado");
    }

    if (lot.status !== "IN_PROGRESS") {
      throw new DomainError("El lote debe estar en estado IN_PROGRESS para finalizar");
    }

    // Calcular costos extra
    let extraCostsTotal = 0;
    if (input.extraCosts) {
      const { labor, machine, overhead, other } = input.extraCosts;
      if (labor) extraCostsTotal += parseFloat(labor);
      if (machine) extraCostsTotal += parseFloat(machine);
      if (overhead) extraCostsTotal += parseFloat(overhead);
      if (other) extraCostsTotal += parseFloat(other);
    }

    // Aquí necesitaríamos obtener el costo total de materiales consumidos
    // Por simplicidad, asumiremos que se calcula en el repo o se pasa
    // En una implementación real, podríamos tener un método para calcular costos del lote

    // Por ahora, usar un costo base (esto debería calcularse sumando LotMaterialConsumption)
    const materialsCost = 0; // TODO: calcular desde LotMaterialConsumption
    const totalCost = materialsCost + extraCostsTotal;
    const unitCost = totalCost / producedQty;

    // Producir inventario (crea InventoryTransaction PRODUCTION_IN y recalcula WAC)
    const result = await this.inventoryRepo.produceIn({
      productId: lot.productId.getValue(),
      qty: input.producedQuantity,
      unitCost: unitCost.toFixed(4),
      companyId: lot.companyId.getValue(),
      lotId: lot.id.getValue(),
    });

    // Finalizar lote
    await this.lotRepo.finish(lotId, input.producedQuantity, unitCost.toFixed(4), totalCost.toFixed(4));

    return {
      unitCost: unitCost.toFixed(4),
      totalCost: totalCost.toFixed(4),
      producedQuantity: input.producedQuantity,
    };
  }
}
