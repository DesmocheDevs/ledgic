import { injectable, inject } from 'tsyringe';
import { type PrismaClient } from '@prisma/client';
import type { InventoryCreateInput, InventoryRepository } from '../../domain';
import { Inventory, EstadoInventario } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

type InventoryStatusDTO = 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
function mapStatusToDomain(status: InventoryStatusDTO): EstadoInventario {
  if (status === 'ACTIVE') return EstadoInventario.ACTIVO;
  if (status === 'INACTIVE') return EstadoInventario.INACTIVO;
  return EstadoInventario.DESCONTINUADO;
}
function mapStatusToPrisma(status: string): InventoryStatusDTO {
  if (status === 'ACTIVO') return 'ACTIVE';
  if (status === 'INACTIVO') return 'INACTIVE';
  return 'OBSOLETE';
}

@injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Inventory | null> {
    const row = await this.prisma.inventory.findUnique({ where: { id: id.getValue() } });
    if (!row) return null;
    return new Inventory(
      UUID.fromString(row.id),
      row.name,
      row.category,
      mapStatusToDomain(row.status),
      row.unitOfMeasure,
      null,
      row.itemType,
      row.createdAt,
      row.updatedAt,
    );
  }

  async findAll(): Promise<Inventory[]> {
    const rows = await this.prisma.inventory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const inventories = rows
      .map((row) => new Inventory(
        UUID.fromString(row.id),
        row.name,
        row.category,
        mapStatusToDomain(row.status),
        row.unitOfMeasure,
        null,
        row.itemType,
        row.createdAt,
        row.updatedAt,
      ))
      .filter((inventory): inventory is Inventory => inventory !== null);
      
    return inventories;
  }

  async create(inventory: InventoryCreateInput): Promise<void> {
    if (!inventory || !inventory.companyId) throw new Error('companyId is required to create Inventory');
    await this.prisma.inventory.create({
      data: {
        companyId: inventory.companyId,
        name: inventory.nombre,
        category: inventory.categoria,
        status: mapStatusToPrisma(inventory.estado),
        unitOfMeasure: inventory.unidadMedida,
        itemType: (inventory.tipo as 'PRODUCT' | 'MATERIAL'),
      },
    });
  }

  async update(inventory: Inventory): Promise<void> {
    await this.prisma.inventory.update({
      where: { id: inventory.id.getValue() },
      data: {
        name: inventory.nombre,
        category: inventory.categoria,
        status: mapStatusToPrisma(inventory.estado),
        unitOfMeasure: inventory.unidadMedida,
        itemType: (inventory.tipo as 'PRODUCT' | 'MATERIAL'),
      },
    });
  }

  async delete(id: UUID): Promise<void> {
    await this.prisma.inventory.delete({ where: { id: id.getValue() } });
  }
}