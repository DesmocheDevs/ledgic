import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute(id: string): Promise<Material | null> {
    return this.repository.findById(UUID.fromString(id));
  }
}
