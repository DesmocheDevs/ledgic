import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import type { ProductRepository } from '../../domain';
import { Product, ProductMaterial } from '../../domain';
import { ProductMapper } from '../mappers/ProductMapper';
import { ProductMaterialMapper } from '../mappers/ProductMaterialMapper';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Product | null> {
    const dto = await this.prisma.product.findUnique({ where: { id: id.getValue() } });
    if (!dto) return null;
    return ProductMapper.toEntity({
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: Number(dto.precio),
      categoria: dto.categoria,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  async findAll(): Promise<Product[]> {
    const list = await this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return list.map((dto) => ProductMapper.toEntity({
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: Number(dto.precio),
      categoria: dto.categoria,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }));
  }

  async create(product: Product): Promise<void> {
    const data = ProductMapper.toDTO(product);
    await this.prisma.product.create({ data });
  }

  async update(product: Product): Promise<void> {
    const data = ProductMapper.toDTO(product);
    await this.prisma.product.update({ where: { id: data.id }, data });
  }

  async delete(id: UUID): Promise<void> {
    await this.prisma.product.delete({ where: { id: id.getValue() } });
  }

  async getMaterials(productId: UUID): Promise<ProductMaterial[]> {
    const list = await this.prisma.productMaterial.findMany({ where: { productId: productId.getValue() } });
    return list.map((dto) => ProductMaterialMapper.toEntity({
      productId: dto.productId,
      materialId: dto.materialId,
      cantidad: Number(dto.cantidad),
      unidadMedida: dto.unidadMedida,
    }));
  }

  async setMaterials(productId: UUID, items: ProductMaterial[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.productMaterial.deleteMany({ where: { productId: productId.getValue() } });
      if (items.length > 0) {
        await tx.productMaterial.createMany({
          data: items.map((i) => ({
            productId: i.productId.getValue(),
            materialId: i.materialId.getValue(),
            cantidad: i.cantidad,
            unidadMedida: i.unidadMedida ?? null,
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
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida ?? null,
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
