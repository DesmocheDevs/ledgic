import { injectable, inject } from 'tsyringe';
import type { InventoryRepository } from '../../domain';
import { GetInventoryUseCase } from './GetInventoryUseCase';
import { Inventory, EstadoInventario } from '../../domain';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { TOKENS } from '../../../../shared/container';

export interface UpdateInventoryRequest {
  nombre?: string;
  categoria?: string;
  estado?: EstadoInventario;
  unidadMedida?: string;
  proveedor?: string | null;
  tipo?: string | null;
}

@injectable()
export class UpdateInventoryUseCase {
  constructor(
    @inject(GetInventoryUseCase) private readonly getInventoryUseCase: GetInventoryUseCase,
    @inject(TOKENS.InventoryRepository) private readonly repository: InventoryRepository,
  ) {}

  async execute(id: string, request: UpdateInventoryRequest): Promise<Inventory> {
    try {
      const inventory = await this.getInventoryUseCase.execute(id);
      
      if (Object.keys(request).length === 0) {
        throw new DomainError('No se proporcionaron datos para actualizar');
      }
      
      inventory.update(request);
      await this.repository.update(inventory);
      
      return inventory;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      
      console.error('Error updating inventory:', error);
      throw new DomainError('No se pudo actualizar el inventario');
    }
  }
}