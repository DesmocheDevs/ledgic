import type { LotMaterialConsumption, ProductionLot } from "../entities/Production";

export interface ProductionRepository {
  createLot(data: Omit<ProductionLot, "id" | "createdAt" | "updatedAt" | "producedQuantity" | "status">): Promise<ProductionLot>;
  getLot(id: string): Promise<ProductionLot | null>;
  listLots(companyId: string): Promise<ProductionLot[]>;
  setStatus(id: string, status: ProductionLot["status"]): Promise<void>;
  addConsumption(lotId: string, materialId: string, quantity: string, unitCost: string): Promise<LotMaterialConsumption>;
  declareProduction(lotId: string, producedQuantity: string, unitCost: string): Promise<void>;
}
