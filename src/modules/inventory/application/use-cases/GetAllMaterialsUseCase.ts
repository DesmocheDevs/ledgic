import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetAllMaterialsUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute(): Promise<Material[]> {
    return this.repository.findAll();
  }
}
