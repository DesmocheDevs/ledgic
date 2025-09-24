import { UUID } from "../../../../shared/domain/value-objects/UUID";

export enum ProductionLotStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export class ProductionLot {
  constructor(
    public readonly id: UUID,
    public readonly companyId: UUID,
    public readonly productId: UUID,
    public readonly lotCode: string,
    public readonly plannedQuantity: string, // decimal as string
    public producedQuantity: string, // decimal as string
    public readonly createdAt: Date,
    public updatedAt: Date,
    public status: ProductionLotStatus,
    public startDate?: Date,
    public endDate?: Date,
    public unitCost?: string, // decimal as string
    public totalCost?: string, // decimal as string
  ) {}

  static create(params: {
    companyId: string;
    productId: string;
    lotCode: string;
    plannedQuantity: string;
  }): ProductionLot {
    const id = UUID.create();
    const now = new Date();
    return new ProductionLot(
      id,
      UUID.fromString(params.companyId),
      UUID.fromString(params.productId),
      params.lotCode,
      params.plannedQuantity,
      "0",
      now,
      now,
      ProductionLotStatus.PLANNED,
    );
  }

  toInProgress(startDate?: Date): void {
    this.status = ProductionLotStatus.IN_PROGRESS;
    this.startDate = startDate || new Date();
    this.updatedAt = new Date();
  }

  finish(producedQuantity: string, unitCost: string, totalCost: string, endDate?: Date): void {
    this.status = ProductionLotStatus.COMPLETED;
    this.producedQuantity = producedQuantity;
    this.unitCost = unitCost;
    this.totalCost = totalCost;
    this.endDate = endDate || new Date();
    this.updatedAt = new Date();
  }
}
