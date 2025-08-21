import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';
import { Client } from '../../domain';
import { ClientMapper } from '../mappers/ClientMapper';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Client | null> {
    const clientDTO = await this.prisma.client.findUnique({ where: { id: id.getValue() } });
    if (!clientDTO) return null;
    return ClientMapper.toEntity(clientDTO);
  }

  async findAll(): Promise<Client[]> {
    const clientsDTO = await this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return clientsDTO.map((dto) => ClientMapper.toEntity(dto));
  }

  async create(client: Client): Promise<void> {
    const clientDTO = ClientMapper.toDTO(client);
    await this.prisma.client.create({ data: clientDTO });
  }

  async update(client: Client): Promise<void> {
    const clientDTO = ClientMapper.toDTO(client);
    await this.prisma.client.update({
      where: { id: clientDTO.id },
      data: clientDTO,
    });
  }

  async delete(id: UUID): Promise<void> {
    await this.prisma.client.delete({ where: { id: id.getValue() } });
  }
}