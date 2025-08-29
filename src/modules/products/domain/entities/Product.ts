import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class Product {
	constructor(
		public readonly id: UUID,
		public nombre: string,
		public descripcion: string | null,
		public precio: number,
		public categoria: string | null,
		public readonly createdAt: Date,
		public updatedAt: Date,
	) {
		this.validate();
	}

	private validate(): void {
		if (!this.nombre || this.nombre.trim().length < 2) {
			throw new DomainError('El nombre del producto debe tener al menos 2 caracteres');
		}
		if (this.descripcion !== null && this.descripcion.trim().length === 0) {
			this.descripcion = null;
		}
		if (this.precio == null || isNaN(this.precio) || this.precio < 0) {
			throw new DomainError('El precio debe ser un número mayor o igual a 0');
		}
		if (this.categoria !== null && this.categoria.trim().length === 0) {
			this.categoria = null;
		}
	}

	update(fields: Partial<{ nombre: string; descripcion: string | null; precio: number; categoria: string | null }>): void {
		if (fields.nombre !== undefined) this.nombre = fields.nombre;
		if (fields.descripcion !== undefined) this.descripcion = fields.descripcion;
		if (fields.precio !== undefined) this.precio = fields.precio;
		if (fields.categoria !== undefined) this.categoria = fields.categoria;
		this.updatedAt = new Date();
		this.validate();
	}
}

