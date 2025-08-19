import { injectable, inject } from 'tsyringe';
import type { ClientRepository } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class DeleteClientUseCase {
  constructor(@inject(TOKENS.ClientRepository) private readonly repository: ClientRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const uuid = UUID.fromString(id);
      const client = await this.repository.findById(uuid);
      
      if (!client) {
        throw new DomainError(`Cliente con ID ${id} no encontrado`);
      }
      
      await this.repository.delete(uuid);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      
      console.error('Error deleting client:', error);
      throw new DomainError('No se pudo eliminar el cliente');
    }
  }
}