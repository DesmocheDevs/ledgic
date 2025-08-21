import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { Product } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface UpdateProductRequest {
  id: string;
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  categoria?: string | null;
  materials?: Array<{ materialId: string; cantidad: number; unidadMedida?: string | null }>;
}

@injectable()
export class UpdateProductUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute({ id, ...fields }: UpdateProductRequest): Promise<Product> {
    const product = await this.repository.findById(UUID.fromString(id));
    if (!product) throw new Error('Producto no encontrado');
    const { materials, ...rest } = fields as { materials?: Array<{ materialId: string; cantidad: number; unidadMedida?: string | null }> } & Partial<Omit<UpdateProductRequest, 'id'>>;
    product.update(rest);
    await this.repository.update(product);
    if (materials) {
      const { ProductMaterial } = await import('../../domain');
      const entities = materials.map((m: { materialId: string; cantidad: number; unidadMedida?: string | null }) => new ProductMaterial(
        UUID.fromString(id),
        UUID.fromString(m.materialId),
        m.cantidad,
        m.unidadMedida ?? null,
      ));
      await this.repository.setMaterials(UUID.fromString(id), entities);
    }
    return product;
  }
}
