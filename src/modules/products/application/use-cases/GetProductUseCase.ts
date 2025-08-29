import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { Product } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetProductUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.repository.findById(UUID.fromString(id));
  }
}
