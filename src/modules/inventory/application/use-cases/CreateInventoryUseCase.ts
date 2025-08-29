import { injectable, inject } from 'tsyringe';
import type { InventoryRepository } from '../../domain';
import { Inventory, EstadoInventario } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface CreateInventoryRequest {
  nombre: string;
  categoria: string;
  estado: EstadoInventario;
  unidadMedida: string;
  proveedor: string | null;
  tipo: string | null;
}

@injectable()
export class CreateInventoryUseCase {
  constructor(@inject(TOKENS.InventoryRepository) private readonly repository: InventoryRepository) {}

  async execute(request: CreateInventoryRequest): Promise<Inventory> {
    const id = UUID.create();
    const now = new Date();

    const inventory = new Inventory(
      id,
      request.nombre,
      request.categoria,
      request.estado,
      request.unidadMedida,
      request.proveedor,
      request.tipo,
      now,
      now,
    );

    await this.repository.create(inventory);
    return inventory;
  }
}