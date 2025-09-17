import { injectable, inject } from 'tsyringe';
import { Prisma, type PrismaClient } from '@prisma/client';
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

  async getMany(ids: string[]): Promise<Array<{ id: string; name: string; currentQuantity: string }>> {
    const rows = await this.prisma.inventory.findMany({
      where: { id: { in: ids } },
    });

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      currentQuantity: row.currentQuantity.toString(),
    }));
  }

  async get(id: string): Promise<Inventory> {
    const row = await this.prisma.inventory.findUnique({ where: { id } });
    if (!row) throw new Error(`Inventory ${id} not found`);

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

  async consume(params: { materialId: string; qty: string; companyId: string; lotId: string }): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Crear LotMaterialConsumption
      await tx.lotMaterialConsumption.create({
        data: {
          productionLotId: params.lotId,
          materialId: params.materialId,
          quantity: params.qty,
          unitCost: "0", // TODO: calcular costo real
          totalCost: "0", // TODO: calcular
        },
      });

      // Crear InventoryTransaction
      await tx.inventoryTransaction.create({
        data: {
          companyId: params.companyId,
          inventoryId: params.materialId,
          productionLotId: params.lotId,
          type: "CONSUMPTION",
          quantity: params.qty,
          unitCost: "0", // TODO
          totalCost: "0", // TODO
          referenceId: params.lotId,
        },
      });

      // Actualizar cantidad en inventory
      await tx.inventory.update({
        where: { id: params.materialId },
        data: {
          currentQuantity: { decrement: new Prisma.Decimal(params.qty) },
          updatedAt: new Date(),
        },
      });
    }, { isolationLevel: 'Serializable' });
  }

  async produceIn(params: { productId: string; qty: string; unitCost: string; companyId: string; lotId: string }): Promise<{ newWAC: string }> {
    return await this.prisma.$transaction(async (tx) => {
      const qty = new Prisma.Decimal(params.qty);
      const unitCost = new Prisma.Decimal(params.unitCost);
      const totalCost = qty.mul(unitCost);

      // Obtener inventario actual
      const inventory = await tx.inventory.findUnique({
        where: { id: params.productId },
      });
      if (!inventory) throw new Error(`Inventory ${params.productId} not found`);

      const currentQty = inventory.currentQuantity;
      const currentValue = inventory.totalInventoryValue || new Prisma.Decimal(0);

      // Calcular nuevo WAC
      const newTotalQty = currentQty.add(qty);
      const newTotalValue = currentValue.add(totalCost);
      const newWAC = newTotalQty.isZero() ? new Prisma.Decimal(0) : newTotalValue.div(newTotalQty);

      // Crear InventoryTransaction
      await tx.inventoryTransaction.create({
        data: {
          companyId: params.companyId,
          inventoryId: params.productId,
          productionLotId: params.lotId,
          type: "PRODUCTION_IN",
          quantity: params.qty,
          unitCost: params.unitCost,
          totalCost: totalCost.toString(),
          referenceId: params.lotId,
        },
      });

      // Actualizar inventario
      await tx.inventory.update({
        where: { id: params.productId },
        data: {
          currentQuantity: { increment: qty },
          totalInventoryValue: newTotalValue,
          weightedAverageCost: newWAC,
          updatedAt: new Date(),
        },
      });

      return { newWAC: newWAC.toString() };
    }, { isolationLevel: 'Serializable' });
  }
}
