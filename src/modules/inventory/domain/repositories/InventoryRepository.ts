import { Inventory } from '../entities/Inventory';
import { UUID } from '../../../../shared/domain/value-objects/UUID';

export type InventoryCreateInput = Inventory & { companyId: string };

export interface InventoryRepository {
  findById(id: UUID): Promise<Inventory | null>;
  findAll(): Promise<Inventory[]>;
  create(inventory: InventoryCreateInput): Promise<void>;
  update(inventory: Inventory): Promise<void>;
  delete(id: UUID): Promise<void>;
}