import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import type { MaterialRepository, RegistroProduccionData } from '../../domain';
import { Material } from '../../domain';
import { MaterialMapper } from '../mappers/MaterialMapper';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';

@injectable()
export class PrismaMaterialRepository implements MaterialRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: UUID): Promise<Material | null> {
    const dto = await this.prisma.material.findUnique({ where: { id: id.getValue() } });
    if (!dto) return null;
    return MaterialMapper.toEntity({
      id: dto.id,
      precioCompra: Number(dto.precioCompra),
      proveedor: dto.proveedor,
      cantidadActual: dto.cantidadActual ? Number(dto.cantidadActual) : null,
      valorTotalInventario: dto.valorTotalInventario ? Number(dto.valorTotalInventario) : null,
      costoPromedioPonderado: dto.costoPromedioPonderado ? Number(dto.costoPromedioPonderado) : null,
      inventarioId: dto.inventarioId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  async findAll(): Promise<Material[]> {
    const list = await this.prisma.material.findMany({ orderBy: { createdAt: 'desc' } });
    return list.map((dto) => MaterialMapper.toEntity({
      id: dto.id,
      precioCompra: Number(dto.precioCompra),
      proveedor: dto.proveedor,
      cantidadActual: dto.cantidadActual ? Number(dto.cantidadActual) : null,
      valorTotalInventario: dto.valorTotalInventario ? Number(dto.valorTotalInventario) : null,
      costoPromedioPonderado: dto.costoPromedioPonderado ? Number(dto.costoPromedioPonderado) : null,
      inventarioId: dto.inventarioId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }));
  }

  async create(material: Material): Promise<void> {
    const data = MaterialMapper.toDTO(material);
    await this.prisma.material.create({ data });
  }

  async update(material: Material): Promise<void> {
    const data = MaterialMapper.toDTO(material);
    await this.prisma.material.update({ where: { id: data.id }, data });
  }

  async delete(id: UUID): Promise<void> {
    await this.prisma.material.delete({ where: { id: id.getValue() } });
  }

  async insertRegistroProduccion(data: RegistroProduccionData): Promise<void> {
    await this.prisma.registro_produccion.create({
      data: {
        id: UUID.create().getValue(),
        lote_id: data.lote_id,
        material_id: data.material_id,
        cantidad: data.cantidad,
        costoUnitario: data.costoUnitario,
        costoTotal: data.costoTotal,
        fecha: data.fecha,
      }
    });
  }
}
