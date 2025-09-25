export interface ApplyEntryInput {
  inventoryId: string;
  quantity: string; // positive for inflow
  unitCost: string;
}

export interface ApplyConsumptionInput {
  inventoryId: string;
  quantity: string; // positive qty to consume
}

export interface WacService {
  applyEntry(input: ApplyEntryInput): Promise<void>;
  applyConsumption(input: ApplyConsumptionInput): Promise<void>;
}
