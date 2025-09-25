import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface CreateMaterialRequest {
  precioCompra: number;
  proveedor: string | null;
  inventarioId: string;
}

@injectable()
export class CreateMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute(request: CreateMaterialRequest): Promise<Material> {
    const id = UUID.create();
    const now = new Date();

    const material = new Material(
      id,
      request.precioCompra,
      request.proveedor,
      UUID.fromString(request.inventarioId),
      null, // cantidadActual
      null, // valorTotalInventario
      null, // costoPromedioPonderado
      now, // createdAt
      now, // updatedAt
    );

    await this.repository.create(material);
    return material;
  }
}
