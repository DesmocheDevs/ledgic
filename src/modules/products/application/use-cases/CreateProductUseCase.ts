import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { Product } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface CreateProductRequest {
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria: string | null;
  materials?: Array<{ materialId: string; cantidad: number; unidadMedida?: string | null }>;
}

@injectable()
export class CreateProductUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    const id = UUID.create();
    const now = new Date();

    const product = new Product(
      id,
      request.nombre,
      request.descripcion,
      request.precio,
      request.categoria,
      now,
      now,
    );

    await this.repository.create(product);

    // Asociar materiales si se especifican
    if (request.materials && request.materials.length > 0) {
      const items = request.materials.map((m) => ({
        productId: id,
        materialId: UUID.fromString(m.materialId),
        cantidad: m.cantidad,
        unidadMedida: m.unidadMedida ?? null,
      }));
      // Map to domain entity ProductMaterial
      const { ProductMaterial } = await import('../../domain');
      const entities = items.map((i) => new ProductMaterial(i.productId, i.materialId, i.cantidad, i.unidadMedida));
      await this.repository.setMaterials(id, entities);
    }
    return product;
  }
}
