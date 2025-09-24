import type { ProductionLot } from "../entities/ProductionLot";

export interface LotRepository {
  create(lot: ProductionLot): Promise<ProductionLot>;
  findById(lotId: string): Promise<ProductionLot | null>;
  toInProgress(lotId: string, date?: Date): Promise<void>;
  finish(lotId: string, producedQuantity: string, unitCost: string, totalCost: string, endDate?: Date): Promise<void>;
}
