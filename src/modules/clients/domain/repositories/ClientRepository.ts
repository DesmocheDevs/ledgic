import { Client } from '../entities/Client';
import { UUID } from '../../../../shared/domain/value-objects/UUID';

export interface ClientRepository {
  findById(id: UUID): Promise<Client | null>;
  findAll(): Promise<Client[]>;
  create(client: Client): Promise<void>;
  update(client: Client): Promise<void>;
  delete(id: UUID): Promise<void>;
}