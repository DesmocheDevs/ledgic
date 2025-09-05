import { injectable, inject } from 'tsyringe';
import type { InventoryRepository, InventoryCreateInput } from '../../domain';
import { Inventory, EstadoInventario } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface CreateInventoryRequest {
  companyId: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
  unitOfMeasure: string;
  itemType: 'PRODUCT' | 'MATERIAL';
}

@injectable()
export class CreateInventoryUseCase {
  constructor(@inject(TOKENS.InventoryRepository) private readonly repository: InventoryRepository) {}

  async execute(request: CreateInventoryRequest): Promise<Inventory> {
    const id = UUID.create();
    const now = new Date();

    const inventory = new Inventory(
      id,
      request.name,
      request.category,
  (request.status === 'ACTIVE' ? EstadoInventario.ACTIVO : request.status === 'INACTIVE' ? EstadoInventario.INACTIVO : EstadoInventario.DESCONTINUADO),
      request.unitOfMeasure,
      null,
      request.itemType,
      now,
      now,
    );

  const payload: InventoryCreateInput = Object.assign(inventory, { companyId: request.companyId });
  await this.repository.create(payload);
    return inventory;
  }
}