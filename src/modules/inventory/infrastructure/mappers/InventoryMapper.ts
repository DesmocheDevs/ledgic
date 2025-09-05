import { Inventory, EstadoInventario } from '../../domain';
import { InventoryDTO } from '../dtos/InventoryDTO';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class InventoryMapper {
  static toEntity(dto: InventoryDTO): Inventory | null {
    try {
      const estado = ((): EstadoInventario => {
        if (dto.status === 'ACTIVE') return EstadoInventario.ACTIVO;
        if (dto.status === 'INACTIVE') return EstadoInventario.INACTIVO;
        return EstadoInventario.DESCONTINUADO;
      })();
      return new Inventory(
        UUID.fromString(dto.id),
        dto.name,
        dto.category,
        estado,
        dto.unitOfMeasure,
        null,
        dto.itemType,
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
      const status: InventoryDTO['status'] = inventory.estado === EstadoInventario.ACTIVO
        ? 'ACTIVE'
        : inventory.estado === EstadoInventario.INACTIVO
        ? 'INACTIVE'
        : 'OBSOLETE';
      return {
        id: inventory.id.getValue(),
        companyId: '',
        name: inventory.nombre,
        category: inventory.categoria,
        status,
        unitOfMeasure: inventory.unidadMedida,
        itemType: (inventory.tipo === 'PRODUCT' || inventory.tipo === 'MATERIAL') ? inventory.tipo : 'MATERIAL',
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
      };
    } catch (error) {
      console.error('Error mapping Entity to DTO:', error);
      throw new DomainError('Error al preparar datos del inventario');
    }
  }
}