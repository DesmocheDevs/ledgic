import { injectable, inject } from 'tsyringe';
import type { ClientRepository } from '../../domain';
import { Client } from '../../domain';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class GetAllClientsUseCase {
  constructor(@inject(TOKENS.ClientRepository) private readonly repository: ClientRepository) {}

  async execute(): Promise<Client[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('No se pudieron obtener los clientes');
    }
  }
}