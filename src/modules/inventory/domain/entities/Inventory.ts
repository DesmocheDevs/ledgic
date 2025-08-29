import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export enum EstadoInventario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  DESCONTINUADO = 'DESCONTINUADO',
}

export class Inventory {
  constructor(
    public readonly id: UUID,
    public nombre: string,
    public categoria: string,
    public estado: EstadoInventario,
    public unidadMedida: string,
    public proveedor: string | null,
    public tipo: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.nombre || this.nombre.trim().length < 2) {
      throw new DomainError('El nombre debe tener al menos 2 caracteres');
    }
    if (!this.categoria || this.categoria.trim().length < 2) {
      throw new DomainError('La categoría debe tener al menos 2 caracteres');
    }
    if (!this.unidadMedida || this.unidadMedida.trim().length === 0) {
      throw new DomainError('La unidad de medida es requerida');
    }
    if (this.unidadMedida.length > 50) {
      throw new DomainError('La unidad de medida no puede exceder 50 caracteres');
    }
    if (!Object.values(EstadoInventario).includes(this.estado)) {
      throw new DomainError('El valor de estado no es válido');
    }
    if (this.proveedor !== null && this.proveedor.trim().length < 2) {
      throw new DomainError('El proveedor debe tener al menos 2 caracteres');
    }
    if (this.tipo !== null && this.tipo.trim().length < 2) {
      throw new DomainError('El tipo debe tener al menos 2 caracteres');
    }
  }

  update(fields: Partial<{
    nombre: string;
    categoria: string;
    estado: EstadoInventario;
    unidadMedida: string;
    proveedor: string | null;
    tipo: string | null;
  }>): void {
    if (fields.nombre) this.nombre = fields.nombre;
    if (fields.categoria) this.categoria = fields.categoria;
    if (fields.estado) this.estado = fields.estado;
    if (fields.unidadMedida) this.unidadMedida = fields.unidadMedida;
    if (fields.proveedor !== undefined) this.proveedor = fields.proveedor;
    if (fields.tipo !== undefined) this.tipo = fields.tipo;
    this.updatedAt = new Date();
    this.validate();
  }
}