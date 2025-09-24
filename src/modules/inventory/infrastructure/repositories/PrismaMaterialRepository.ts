import { injectable, inject } from 'tsyringe';
import { Prisma, type PrismaClient, ItemType, InventoryStatus } from '@prisma/client';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { MaterialMapper } from '../mappers/MaterialMapper';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class PrismaMaterialRepository implements MaterialRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Material | null> {
    const material = await this.prisma.inventory.findUnique({
      where: { 
        id: id.getValue(),
        itemType: ItemType.MATERIAL
      },
      include: { 
        materialDetails: {
          include: {
            supplier: true
          }
        }
      }
    });

    if (!material || !material.materialDetails) return null;

    const details = material.materialDetails;
    return MaterialMapper.toEntity({
      id: material.id,
      inventarioId: material.id, // Using inventory id as inventarioId
      precioCompra: details.unitPrice ? Number(details.unitPrice) : 0,
      proveedor: details.supplierCompanyId,
      cantidadActual: material.currentQuantity ? Number(material.currentQuantity) : 0,
      valorTotalInventario: material.totalInventoryValue ? Number(material.totalInventoryValue) : null,
      costoPromedioPonderado: material.weightedAverageCost ? Number(material.weightedAverageCost) : null,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt
    });
  }

  async findAll(): Promise<Material[]> {
    const materials = await this.prisma.inventory.findMany({
      where: { 
        itemType: ItemType.MATERIAL,
        status: { not: InventoryStatus.INACTIVE }
      },
      include: {
        materialDetails: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1000,
      skip: 0
    });

    return materials
      .filter((material): material is typeof material & { materialDetails: NonNullable<typeof material.materialDetails> } => 
        material.materialDetails !== null
      )
      .map(material => {
        const details = material.materialDetails;
        return MaterialMapper.toEntity({
          id: material.id,
          inventarioId: material.id,
          precioCompra: details.unitPrice ? Number(details.unitPrice) : 0,
          proveedor: details.supplierCompanyId || null,
          cantidadActual: material.currentQuantity ? Number(material.currentQuantity) : 0,
          valorTotalInventario: material.totalInventoryValue ? Number(material.totalInventoryValue) : null,
          costoPromedioPonderado: material.weightedAverageCost ? Number(material.weightedAverageCost) : null,
          createdAt: material.createdAt,
          updatedAt: material.updatedAt
        });
      });
  }

  async create(material: Material): Promise<void> {
    const data = MaterialMapper.toDTO(material);
    
    await this.prisma.$transaction(async (tx) => {
      // Create inventory record
      const inventory = await tx.inventory.create({
        data: {
          id: data.id,
          companyId: data.inventarioId, // Using inventarioId as companyId
          name: 'Material ' + data.id, // Default name with ID
          category: 'MATERIAL',
          status: InventoryStatus.ACTIVE,
          unitOfMeasure: 'UNIDAD',
          itemType: ItemType.MATERIAL,
          currentQuantity: data.cantidadActual || 0,
          totalInventoryValue: data.valorTotalInventario ? new Prisma.Decimal(data.valorTotalInventario) : null,
          weightedAverageCost: data.costoPromedioPonderado ? new Prisma.Decimal(data.costoPromedioPonderado) : null,
          materialDetails: {
            create: {
              unitPrice: new Prisma.Decimal(data.precioCompra),
              supplierCompanyId: data.proveedor || null
            }
          }
        },
        include: {
          materialDetails: true
        }
      });

      if (!inventory || !inventory.materialDetails) {
        throw new Error('Failed to create material');
      }
    });
  }

  async update(material: Material): Promise<void> {
    const data = MaterialMapper.toDTO(material);
    
    await this.prisma.$transaction(async (tx) => {
      // Verify material exists and is active
      const existing = await tx.inventory.findUnique({
        where: { 
          id: data.inventarioId,
          itemType: ItemType.MATERIAL,
          status: { not: InventoryStatus.INACTIVE }
        },
        include: { materialDetails: true }
      });

      if (!existing || !existing.materialDetails) {
        throw new Error('Material not found or has been deleted');
      }

      // Update inventory
      await tx.inventory.update({
        where: { id: data.inventarioId },
        data: {
          currentQuantity: data.cantidadActual || 0,
          totalInventoryValue: data.valorTotalInventario ? new Prisma.Decimal(data.valorTotalInventario) : null,
          weightedAverageCost: data.costoPromedioPonderado ? new Prisma.Decimal(data.costoPromedioPonderado) : null,
          updatedAt: new Date()
        }
      });

      // Update material details
      await tx.materialDetails.update({
        where: { inventoryId: data.inventarioId },
        data: {
          unitPrice: new Prisma.Decimal(data.precioCompra),
          supplierCompanyId: data.proveedor || null
        }
      });
    });
  }

  async delete(id: UUID): Promise<void> {
    // Update status to INACTIVE instead of deleting
    await this.prisma.inventory.update({
      where: { 
        id: id.getValue(),
        itemType: ItemType.MATERIAL
      },
      data: { 
        status: InventoryStatus.INACTIVE,
        updatedAt: new Date()
      }
    });
    // Material details will be automatically deleted due to onDelete: Cascade
  }

  // Método obsoleto - Usar módulos de production/ledger en su lugar
  async insertRegistroProduccion(): Promise<void> {
    throw new Error('Este método está obsoleto. Usar módulos de production/ledger');
  }
}
