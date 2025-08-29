import { Inventory, EstadoInventario } from '../../domain';
import { InventoryDTO, EstadoInventarioDTO } from '../dtos/InventoryDTO';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class InventoryMapper {
  private static mapEstadoFromDTO(estadoDTO: EstadoInventarioDTO): EstadoInventario {
    const estadoMap: Record<EstadoInventarioDTO, EstadoInventario> = {
      ACTIVO: EstadoInventario.ACTIVO,
      INACTIVO: EstadoInventario.INACTIVO,
      DESCONTINUADO: EstadoInventario.DESCONTINUADO,
    };
    
    const estado = estadoMap[estadoDTO];
    if (!estado) {
      throw new DomainError(`Estado inválido: ${estadoDTO}`);
    }
    
    return estado;
  }

  private static mapEstadoToDTO(estado: EstadoInventario): EstadoInventarioDTO {
    const estadoMap: Record<EstadoInventario, EstadoInventarioDTO> = {
      [EstadoInventario.ACTIVO]: 'ACTIVO',
      [EstadoInventario.INACTIVO]: 'INACTIVO',
      [EstadoInventario.DESCONTINUADO]: 'DESCONTINUADO',
    };
    
    return estadoMap[estado];
  }

  static toEntity(dto: InventoryDTO): Inventory | null {
    try {
      return new Inventory(
        UUID.fromString(dto.id),
        dto.nombre,
        dto.categoria,
        this.mapEstadoFromDTO(dto.estado),
        dto.unidadMedida,
        dto.proveedor,
        dto.tipo,
        dto.createdAt,
        dto.updatedAt,
      );
    } catch (error) {
      if (error instanceof DomainError) {
        console.warn(`Inventario inválido omitido (ID: ${dto.id}): ${error.message}`);
        return null;
      }
      console.error('Error inesperado al mapear DTO a Entidad:', error);
      throw new Error('Error inesperado al convertir datos del inventario');
    }
  }

  static toDTO(inventory: Inventory): InventoryDTO {
    try {
      return {
        id: inventory.id.getValue(),
        nombre: inventory.nombre,
        categoria: inventory.categoria,
        estado: this.mapEstadoToDTO(inventory.estado),
        unidadMedida: inventory.unidadMedida,
        proveedor: inventory.proveedor,
        tipo: inventory.tipo,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
      };
    } catch (error) {
      console.error('Error mapping Entity to DTO:', error);
      throw new DomainError('Error al preparar datos del inventario');
    }
  }
}