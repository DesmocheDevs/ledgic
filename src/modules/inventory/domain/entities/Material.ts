import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class Material {
  constructor(
    public readonly id: UUID,
    public precioCompra: number,
    public proveedor: string | null,
    public readonly inventarioId: UUID,
    public cantidadActual: number | null,
    public valorTotalInventario: number | null,
    public costoPromedioPonderado: number | null,
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
    if (this.cantidadActual !== null && (isNaN(this.cantidadActual) || this.cantidadActual < 0)) {
      throw new DomainError('La cantidad actual debe ser un número mayor o igual a 0');
    }
    if (this.valorTotalInventario !== null && (isNaN(this.valorTotalInventario) || this.valorTotalInventario < 0)) {
      throw new DomainError('El valor total del inventario debe ser un número mayor o igual a 0');
    }
    if (this.costoPromedioPonderado !== null && (isNaN(this.costoPromedioPonderado) || this.costoPromedioPonderado < 0)) {
      throw new DomainError('El costo promedio ponderado debe ser un número mayor o igual a 0');
    }
  }

  update(fields: Partial<{
    precioCompra: number;
    proveedor: string | null;
    cantidadActual: number | null;
    valorTotalInventario: number | null;
    costoPromedioPonderado: number | null;
  }>): void {
    if (fields.precioCompra !== undefined) this.precioCompra = fields.precioCompra;
    if (fields.proveedor !== undefined) this.proveedor = fields.proveedor;
    if (fields.cantidadActual !== undefined) this.cantidadActual = fields.cantidadActual;
    if (fields.valorTotalInventario !== undefined) this.valorTotalInventario = fields.valorTotalInventario;
    if (fields.costoPromedioPonderado !== undefined) this.costoPromedioPonderado = fields.costoPromedioPonderado;
    this.updatedAt = new Date();
    this.validate();
  }
}
