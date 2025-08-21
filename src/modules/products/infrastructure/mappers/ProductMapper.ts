import { Product } from '../../domain';
import { ProductDTO } from '../dtos/ProductDTO';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class ProductMapper {
  static toEntity(dto: ProductDTO): Product {
    try {
      return new Product(
        UUID.fromString(dto.id),
        dto.nombre,
        dto.descripcion,
        Number(dto.precio),
        dto.categoria,
        dto.createdAt,
        dto.updatedAt,
      );
    } catch (error) {
      console.error('Error mapping Product DTO to Entity:', error);
      throw new DomainError('Error al convertir datos del producto');
    }
  }

  static toDTO(product: Product): ProductDTO {
    try {
      return {
        id: product.id.getValue(),
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: Number(product.precio),
        categoria: product.categoria,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    } catch (error) {
      console.error('Error mapping Product Entity to DTO:', error);
      throw new DomainError('Error al preparar datos del producto');
    }
  }
}
