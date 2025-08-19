import { injectable, inject } from 'tsyringe';
import type { ClientRepository } from '../../domain';
import { Client, Sexo } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

export interface CreateClientRequest {
  nombre: string;
  apellido: string;
  cedula: string;
  numero: string | null;
  correo: string;
  direccion: string;
  sexo: Sexo;
}

@injectable()
export class CreateClientUseCase {
  constructor(@inject(TOKENS.ClientRepository) private readonly repository: ClientRepository) {}

  async execute(request: CreateClientRequest): Promise<Client> {
    const id = UUID.create();
    const now = new Date();

    const client = new Client(
      id,
      request.nombre,
      request.apellido,
      request.cedula,
      request.numero,
      request.correo,
      request.direccion,
      request.sexo,
      now,
      now,
    );

    await this.repository.create(client);
    return client;
  }
}