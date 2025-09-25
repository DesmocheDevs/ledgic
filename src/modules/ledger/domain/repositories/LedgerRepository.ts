export interface PostTransactionInput {
  companyId: string;
  inventoryId: string;
  type: "INIT" | "PURCHASE" | "PRODUCTION_IN" | "CONSUMPTION" | "ADJUSTMENT";
  quantity: string; // Decimal
  unitCost: string; // Decimal
  referenceId?: string | null;
  purchaseId?: string | null;
  productionLotId?: string | null;
  note?: string | null;
}

export interface LedgerRepository {
  post(input: PostTransactionInput): Promise<void>;
}
