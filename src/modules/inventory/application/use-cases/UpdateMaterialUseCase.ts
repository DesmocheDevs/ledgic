import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface UpdateMaterialRequest {
  id: string;
  precioCompra?: number;
  proveedor?: string | null;
}

@injectable()
export class UpdateMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute({ id, ...fields }: UpdateMaterialRequest): Promise<Material> {
    const material = await this.repository.findById(UUID.fromString(id));
    if (!material) throw new Error('Material no encontrado');
    material.update({ precioCompra: fields.precioCompra, proveedor: fields.proveedor });
    await this.repository.update(material);
    return material;
  }
}
