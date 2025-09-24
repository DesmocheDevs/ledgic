import { Prisma, PrismaClient, ItemType, InventoryStatus } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { Product } from '../../domain/entities/Product';
import { ProductMaterial } from '../../domain/entities/ProductMaterial';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { ProductMapper } from '../mappers/ProductMapper';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Product | null> {
    // Use findFirst to allow filtering by non-unique fields
    const row = await this.prisma.inventory.findFirst({
      where: {
        id: id.getValue(),
        itemType: ItemType.PRODUCT,
        status: { not: InventoryStatus.INACTIVE },
      },
      include: { productDetails: true },
    });

    if (!row || !row.productDetails) return null;

    return ProductMapper.toEntity({
      id: row.id,
      nombre: row.name,
      descripcion: row.productDetails.description ?? null,
      precio: row.productDetails.salePrice ? Number(row.productDetails.salePrice) : 0,
      categoria: row.category,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.prisma.inventory.findMany({
      where: {
        itemType: ItemType.PRODUCT,
        status: { not: InventoryStatus.INACTIVE },
      },
      include: { productDetails: true },
      orderBy: { name: 'asc' },
      take: 100,
    });

    const products = rows
      .map((row) => {
        if (!row.productDetails) return null;
        return ProductMapper.toEntity({
          id: row.id,
          nombre: row.name,
          descripcion: row.productDetails.description ?? null,
          precio: row.productDetails.salePrice ? Number(row.productDetails.salePrice) : 0,
          categoria: row.category,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        });
      })
      .filter((p): p is Product => p !== null);

    return products;
  }

  async create(product: Product): Promise<void> {
    const dto = ProductMapper.toDTO(product);

    await this.prisma.$transaction(async (tx) => {
      // Try to use any existing company as default context
      const company = await tx.company.findFirst({ select: { id: true } });
      if (!company) {
        throw new Error('No hay compañías registradas para asociar el producto');
      }

      await tx.inventory.create({
        data: {
          companyId: company.id,
          name: dto.nombre,
          category: dto.categoria ?? 'General',
          status: InventoryStatus.ACTIVE,
          unitOfMeasure: 'unidad',
          itemType: ItemType.PRODUCT,
          productDetails: {
            create: {
              description: dto.descripcion ?? null,
              salePrice: new Prisma.Decimal(dto.precio ?? 0),
            },
          },
        },
      });
    });
  }

  async update(product: Product): Promise<void> {
    const dto = ProductMapper.toDTO(product);

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.inventory.findFirst({
        where: {
          id: dto.id,
          itemType: ItemType.PRODUCT,
          status: { not: InventoryStatus.INACTIVE },
        },
        include: { productDetails: true },
      });

      if (!existing || !existing.productDetails) {
        throw new Error('El producto no existe o ha sido eliminado');
      }

      await tx.inventory.update({
        where: { id: dto.id },
        data: {
          name: dto.nombre,
          category: dto.categoria ?? 'General',
          // keep existing unitOfMeasure/status
          productDetails: {
            update: {
              description: dto.descripcion ?? existing.productDetails.description,
              salePrice: new Prisma.Decimal(dto.precio ?? 0),
            },
          },
        },
      });
    });
  }

  async delete(id: UUID): Promise<void> {
    // Soft delete: mark inventory as INACTIVE for safety
    await this.prisma.inventory.update({
      where: { id: id.getValue() },
      data: { status: InventoryStatus.INACTIVE },
    });
  }

  async getMaterials(productId: UUID): Promise<ProductMaterial[]> {
    const rows = await this.prisma.productMaterial.findMany({
      where: { productId: productId.getValue() },
      include: { material: { include: { materialDetails: true } } },
      orderBy: { material: { name: 'asc' } },
    });

    return rows.map(
      (row) =>
        new ProductMaterial(
          UUID.fromString(row.productId),
          UUID.fromString(row.materialId),
          Number(row.quantity),
          row.unitOfMeasure ?? null,
        ),
    );
  }

  async setMaterials(productId: UUID, items: ProductMaterial[]): Promise<void> {
    const productIdValue = productId.getValue();
    
    await this.prisma.$transaction(async (tx) => {
      // 1. Verificar que el producto existe
      const product = await tx.inventory.findFirst({
        where: { id: productIdValue, itemType: ItemType.PRODUCT, status: { not: InventoryStatus.INACTIVE } },
        select: { id: true },
      });

      if (!product) {
        throw new Error('El producto no existe o ha sido eliminado');
      }

      // 2. Verificar que todos los materiales existen
      const materialIds = items.map(i => i.materialId.getValue());
      const existingMaterials = await tx.inventory.findMany({
        where: { id: { in: materialIds }, itemType: ItemType.MATERIAL, status: { not: InventoryStatus.INACTIVE } },
        select: { id: true },
      });

      if (existingMaterials.length !== materialIds.length) {
        const existingIds = new Set(existingMaterials.map(m => m.id));
        const missingIds = materialIds.filter(id => !existingIds.has(id));
        throw new Error(`Los siguientes materiales no existen o han sido eliminados: ${missingIds.join(', ')}`);
      }

      // 3. Eliminar relaciones existentes
      await tx.productMaterial.deleteMany({ 
        where: { productId: productIdValue } 
      });

      // 4. Crear nuevas relaciones si hay elementos
      if (items.length > 0) {
        await tx.productMaterial.createMany({
          data: items.map(item => ({
            productId: productIdValue,
            materialId: item.materialId.getValue(),
            quantity: new Prisma.Decimal(item.cantidad),
            unitOfMeasure: item.unidadMedida ?? null,
          })),
        });
      }
    });
  }

  async addMaterial(item: ProductMaterial): Promise<void> {
    await this.prisma.productMaterial.create({
      data: {
        productId: item.productId.getValue(),
        materialId: item.materialId.getValue(),
        quantity: new Prisma.Decimal(item.cantidad),
        unitOfMeasure: item.unidadMedida ?? null,
      },
    });
  }

  async removeMaterial(productId: UUID, materialId: UUID): Promise<void> {
    await this.prisma.productMaterial.delete({
      where: {
        productId_materialId: {
          productId: productId.getValue(),
          materialId: materialId.getValue(),
        },
      },
    });
  }
}
