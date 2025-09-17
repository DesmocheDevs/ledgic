import type { BomItem } from "../entities/Bom";

export interface BomRepository {
  getByProduct(productId: string): Promise<BomItem[]>;
  replace(productId: string, items: BomItem[]): Promise<void>;
}
