import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class DeleteMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(UUID.fromString(id));
  }
}
