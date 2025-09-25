import type { LotRepository } from "../../domain/repositories/LotRepository";
import type { BomRepository } from "../../../bom/domain/repositories/BomRepository";
import { ProductionLot } from "../../domain/entities/ProductionLot";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

export interface CreateLotInput {
  companyId: string;
  productId: string;
  lotCode: string;
  plannedQuantity: string;
}

export interface LotRequirement {
  materialId: string;
  quantity: string;
  unitOfMeasure?: string;
}

export interface CreateLotOutput {
  lot: ProductionLot;
  requirements: LotRequirement[];
}

export class CreateLotUseCase {
  constructor(
    private readonly lotRepo: LotRepository,
    private readonly bomRepo: BomRepository,
  ) {}

  async execute(input: CreateLotInput): Promise<CreateLotOutput> {
    // Validar entrada
    if (!input.companyId || !input.productId || !input.lotCode || !input.plannedQuantity) {
      throw new DomainError("Campos requeridos faltantes");
    }

    const plannedQty = parseFloat(input.plannedQuantity);
    if (isNaN(plannedQty) || plannedQty <= 0) {
      throw new DomainError("Cantidad planificada inválida");
    }

    // Crear lote
    const lot = ProductionLot.create(input);
    await this.lotRepo.create(lot);

    // Obtener BOM y calcular requerimientos
    const bomItems = await this.bomRepo.getByProduct(input.productId);
    const requirements: LotRequirement[] = bomItems.map(item => ({
      materialId: item.materialId,
      quantity: (parseFloat(item.quantity) * plannedQty).toFixed(4),
      unitOfMeasure: item.unitOfMeasure || undefined,
    }));

    return { lot, requirements };
  }
}
