import { injectable, inject } from 'tsyringe';
import type { ClientRepository } from '../../domain';
import { GetClientUseCase } from './GetClientUseCase';
import { Client, Sexo } from '../../domain';
import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { TOKENS } from '../../../../shared/container';

export interface UpdateClientRequest {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  numero?: string | null;
  correo?: string;
  direccion?: string;
  sexo?: Sexo;
}

@injectable()
export class UpdateClientUseCase {
  constructor(
    @inject(GetClientUseCase) private readonly getClientUseCase: GetClientUseCase,
    @inject(TOKENS.ClientRepository) private readonly repository: ClientRepository,
  ) {}

  async execute(id: string, request: UpdateClientRequest): Promise<Client> {
    try {
      const client = await this.getClientUseCase.execute(id);
      
      if (Object.keys(request).length === 0) {
        throw new DomainError('No se proporcionaron datos para actualizar');
      }
      
      client.update(request);
      await this.repository.update(client);
      
      return client;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      
      console.error('Error updating client:', error);
      throw new DomainError('No se pudo actualizar el cliente');
    }
  }
}