import { Material } from '../../domain';
import { MaterialDTO } from '../dtos/MaterialDTO';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class MaterialMapper {
  static toEntity(dto: MaterialDTO): Material {
    try {
      return new Material(
        UUID.fromString(dto.id),
        Number(dto.precioCompra),
        dto.proveedor,
        UUID.fromString(dto.inventarioId),
        dto.cantidadActual !== null ? Number(dto.cantidadActual) : null,
        dto.valorTotalInventario !== null ? Number(dto.valorTotalInventario) : null,
        dto.costoPromedioPonderado !== null ? Number(dto.costoPromedioPonderado) : null,
        dto.createdAt,
        dto.updatedAt,
      );
    } catch (error) {
      console.error('Error mapping Material DTO to Entity:', error);
      throw new DomainError('Error al convertir datos del material');
    }
  }

  static toDTO(material: Material): MaterialDTO {
    try {
      return {
        id: material.id.getValue(),
        precioCompra: Number(material.precioCompra),
        proveedor: material.proveedor,
        cantidadActual: material.cantidadActual,
        valorTotalInventario: material.valorTotalInventario,
        costoPromedioPonderado: material.costoPromedioPonderado,
        inventarioId: material.inventarioId.getValue(),
        createdAt: material.createdAt,
        updatedAt: material.updatedAt,
      };
    } catch (error) {
      console.error('Error mapping Material Entity to DTO:', error);
      throw new DomainError('Error al preparar datos del material');
    }
  }
}
