import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { ProductMaterial } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

@injectable()
export class GetProductMaterialsUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(productId: string): Promise<ProductMaterial[]> {
    const pid = UUID.fromString(productId);
    const product = await this.repository.findById(pid);
    if (!product) throw new DomainError('Producto no encontrado');
    return this.repository.getMaterials(pid);
  }
}
