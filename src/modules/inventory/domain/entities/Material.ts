import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class Material {
  constructor(
    public readonly id: UUID,
    public precioCompra: number,
    public proveedor: string | null,
    public readonly inventarioId: UUID,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.precioCompra == null || isNaN(this.precioCompra) || this.precioCompra < 0) {
      throw new DomainError('El precio de compra debe ser un número mayor o igual a 0');
    }
    if (this.proveedor !== null && this.proveedor.trim().length < 2) {
      throw new DomainError('El proveedor debe tener al menos 2 caracteres');
    }
  }

  update(fields: Partial<{ precioCompra: number; proveedor: string | null }>): void {
    if (fields.precioCompra !== undefined) this.precioCompra = fields.precioCompra;
    if (fields.proveedor !== undefined) this.proveedor = fields.proveedor;
    this.updatedAt = new Date();
    this.validate();
  }
}
