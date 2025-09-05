import type { BomItem } from "../entities/Bom";

export interface BomRepository {
  list(productId: string): Promise<BomItem[]>;
  upsert(productId: string, items: BomItem[]): Promise<void>;
}
