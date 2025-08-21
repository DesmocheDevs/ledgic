import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

@injectable()
export class RemoveProductMaterialUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(productId: string, materialId: string): Promise<void> {
    const pid = UUID.fromString(productId);
    const mid = UUID.fromString(materialId);
    const product = await this.repository.findById(pid);
    if (!product) throw new DomainError('Producto no encontrado');
    await this.repository.removeMaterial(pid, mid);
  }
}
