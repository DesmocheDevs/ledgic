import { ProductMaterial } from '../../domain';
import { ProductMaterialDTO } from '../dtos/ProductMaterialDTO';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class ProductMaterialMapper {
  static toEntity(dto: ProductMaterialDTO): ProductMaterial {
    try {
      return new ProductMaterial(
        UUID.fromString(dto.productId),
        UUID.fromString(dto.materialId),
        Number(dto.cantidad),
        dto.unidadMedida ?? null,
      );
    } catch (error) {
      console.error('Error mapping ProductMaterial DTO to Entity:', error);
      throw new DomainError('Error al convertir datos del ProductMaterial');
    }
  }

  static toDTO(entity: ProductMaterial): ProductMaterialDTO {
    try {
      return {
        productId: entity.productId.getValue(),
        materialId: entity.materialId.getValue(),
        cantidad: Number(entity.cantidad),
        unidadMedida: entity.unidadMedida,
      };
    } catch (error) {
      console.error('Error mapping ProductMaterial Entity to DTO:', error);
      throw new DomainError('Error al preparar datos del ProductMaterial');
    }
  }
}
