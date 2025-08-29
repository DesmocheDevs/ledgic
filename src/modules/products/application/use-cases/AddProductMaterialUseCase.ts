import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { ProductMaterial } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export interface AddProductMaterialRequest {
  productId: string;
  materialId: string;
  cantidad: number;
  unidadMedida?: string | null;
}

@injectable()
export class AddProductMaterialUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(req: AddProductMaterialRequest): Promise<void> {
    const pid = UUID.fromString(req.productId);
    const product = await this.repository.findById(pid);
    if (!product) throw new DomainError('Producto no encontrado');

    if (typeof req.cantidad !== 'number' || req.cantidad <= 0) {
      throw new DomainError('cantidad debe ser un número > 0');
    }
    if (req.unidadMedida !== undefined && req.unidadMedida !== null && req.unidadMedida.length > 50) {
      throw new DomainError('unidadMedida no puede exceder 50 caracteres');
    }

    const item = new ProductMaterial(
      pid,
      UUID.fromString(req.materialId),
      req.cantidad,
      req.unidadMedida ?? null,
    );

    await this.repository.addMaterial(item);
  }
}
