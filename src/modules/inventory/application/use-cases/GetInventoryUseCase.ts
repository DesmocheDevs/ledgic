import { injectable, inject } from 'tsyringe';
import type { InventoryRepository } from '../../domain';
import { Inventory } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetInventoryUseCase {
  constructor(@inject(TOKENS.InventoryRepository) private readonly repository: InventoryRepository) {}

  async execute(id: string): Promise<Inventory> {
    try {
      const uuid = UUID.fromString(id);
      const inventory = await this.repository.findById(uuid);
      
      if (!inventory) {
        throw new DomainError('Inventario no encontrado');
      }
      
      return inventory;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      
      console.error('Error getting inventory:', error);
      throw new DomainError('No se pudo obtener el inventario');
    }
  }
}