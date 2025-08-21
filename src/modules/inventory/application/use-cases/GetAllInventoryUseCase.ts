import { injectable, inject } from 'tsyringe';
import type { InventoryRepository } from '../../domain';
import { Inventory } from '../../domain';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetAllInventoryUseCase {
  constructor(@inject(TOKENS.InventoryRepository) private readonly repository: InventoryRepository) {}

  async execute(): Promise<Inventory[]> {
    return await this.repository.findAll();
  }
}