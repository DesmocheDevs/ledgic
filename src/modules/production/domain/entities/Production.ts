export interface ProductionLot {
  id: string;
  companyId: string;
  productId: string;
  lotCode: string;
  plannedQuantity: string;
  producedQuantity: string;
  unitCost?: string | null;
  totalCost?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
}

export interface LotMaterialConsumption {
  id: string;
  productionLotId: string;
  materialId: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
}
