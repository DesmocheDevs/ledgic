import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import type { InventoryRepository } from '../../domain';
import { Inventory } from '../../domain';
import { InventoryMapper } from '../mappers/InventoryMapper';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Inventory | null> {
    const inventoryDTO = await this.prisma.inventory.findUnique({ where: { id: id.getValue() } });
    if (!inventoryDTO) return null;
    
    const inventory = InventoryMapper.toEntity(inventoryDTO);
    return inventory;
  }

  async findAll(): Promise<Inventory[]> {
    const inventoriesDTO = await this.prisma.inventory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const inventories = inventoriesDTO
      .map((dto) => InventoryMapper.toEntity(dto))
      .filter((inventory): inventory is Inventory => inventory !== null);
      
    return inventories;
  }

  async create(inventory: Inventory): Promise<void> {
    const inventoryDTO = InventoryMapper.toDTO(inventory);
    await this.prisma.inventory.create({ data: inventoryDTO });
  }

  async update(inventory: Inventory): Promise<void> {
    const inventoryDTO = InventoryMapper.toDTO(inventory);
    await this.prisma.inventory.update({
      where: { id: inventoryDTO.id },
      data: inventoryDTO,
    });
  }

  async delete(id: UUID): Promise<void> {
    await this.prisma.inventory.delete({ where: { id: id.getValue() } });
  }
}