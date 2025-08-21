import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class DeleteProductUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(UUID.fromString(id));
  }
}
