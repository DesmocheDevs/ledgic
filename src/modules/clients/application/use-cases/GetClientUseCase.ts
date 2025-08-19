import { injectable, inject } from 'tsyringe';
import type { ClientRepository } from '../../domain';
import { Client } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetClientUseCase {
  constructor(@inject(TOKENS.ClientRepository) private readonly repository: ClientRepository) {}

  async execute(id: string): Promise<Client> {
    try {
      const uuid = UUID.fromString(id);
      const client = await this.repository.findById(uuid);
      
      if (!client) {
        throw new DomainError(`Cliente con ID ${id} no encontrado`);
      }
      
      return client;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      
      console.error('Error getting client:', error);
      throw new DomainError('No se pudo obtener el cliente');
    }
  }
}