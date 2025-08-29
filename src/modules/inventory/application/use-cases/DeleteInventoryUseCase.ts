import { injectable, inject } from 'tsyringe';
import type { InventoryRepository } from '../../domain';
import { GetInventoryUseCase } from './GetInventoryUseCase';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class DeleteInventoryUseCase {
  constructor(
    @inject(GetInventoryUseCase) private readonly getInventoryUseCase: GetInventoryUseCase,
    @inject(TOKENS.InventoryRepository) private readonly repository: InventoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      // Verificar que el inventario existe antes de eliminarlo
      await this.getInventoryUseCase.execute(id);
      
      const uuid = UUID.fromString(id);
      await this.repository.delete(uuid);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      
      console.error('Error deleting inventory:', error);
      throw new DomainError('No se pudo eliminar el inventario');
    }
  }
}