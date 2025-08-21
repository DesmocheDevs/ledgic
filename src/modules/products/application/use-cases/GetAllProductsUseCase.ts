import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { Product } from '../../domain';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetAllProductsUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repository.findAll();
  }
}
