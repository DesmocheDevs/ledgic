import type { LotRepository } from "../../domain/repositories/LotRepository";
import type { InventoryRepository } from "../../../inventory/domain/repositories/InventoryRepository";
import type { BomRepository } from "../../../bom/domain/repositories/BomRepository";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

export interface ConsumeMaterialsInput {
  usePlanned?: boolean;
  items?: Array<{ materialId: string; quantity: string }>;
}

export class ConsumeMaterialsUseCase {
  constructor(
    private readonly lotRepo: LotRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly bomRepo: BomRepository,
  ) {}

  async execute(lotId: string, input: ConsumeMaterialsInput): Promise<void> {
    // Obtener lote
    const lot = await this.lotRepo.findById(lotId);
    if (!lot) {
      throw new DomainError("Lote no encontrado");
    }

    if (lot.status !== "PLANNED") {
      throw new DomainError("El lote debe estar en estado PLANNED para consumir materiales");
    }

    // Determinar items a consumir
    let itemsToConsume: Array<{ materialId: string; quantity: string }> = [];

    if (input.usePlanned) {
      // Usar BOM planificada
      const bomItems = await this.bomRepo.getByProduct(lot.productId.getValue());
      const plannedQty = parseFloat(lot.plannedQuantity);
      itemsToConsume = bomItems.map(item => ({
        materialId: item.materialId,
        quantity: (parseFloat(item.quantity) * plannedQty).toFixed(4),
      }));
    } else if (input.items) {
      itemsToConsume = input.items;
    } else {
      throw new DomainError("Debe especificar usePlanned=true o proporcionar items");
    }

    // Validar stock disponible para cada material
    const materialIds = itemsToConsume.map(item => item.materialId);
    const materials = await this.inventoryRepo.getMany(materialIds);

    for (const item of itemsToConsume) {
      const material = materials.find(m => m.id === item.materialId);
      if (!material) {
        throw new DomainError(`Material ${item.materialId} no encontrado`);
      }

      const availableQty = parseFloat(material.currentQuantity);
      const consumeQty = parseFloat(item.quantity);

      if (consumeQty > availableQty) {
        throw new DomainError(`Stock insuficiente para material ${material.name}: disponible ${availableQty}, requerido ${consumeQty}`);
      }
    }

    // Consumir materiales (esto creará LotMaterialConsumption y InventoryTransaction internamente)
    for (const item of itemsToConsume) {
      await this.inventoryRepo.consume({
        materialId: item.materialId,
        qty: item.quantity,
        companyId: lot.companyId.getValue(),
        lotId: lot.id.getValue(),
      });
    }

    // Cambiar lote a IN_PROGRESS
    await this.lotRepo.toInProgress(lotId);
  }
}
