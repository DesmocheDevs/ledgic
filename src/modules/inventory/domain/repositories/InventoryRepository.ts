import { Inventory } from '../entities/Inventory';
import { UUID } from '../../../../shared/domain/value-objects/UUID';

export interface InventoryRepository {
  findById(id: UUID): Promise<Inventory | null>;
  findAll(): Promise<Inventory[]>;
  create(inventory: Inventory): Promise<void>;
  update(inventory: Inventory): Promise<void>;
  delete(id: UUID): Promise<void>;
}