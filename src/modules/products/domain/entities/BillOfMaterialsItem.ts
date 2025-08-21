import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export class BillOfMaterialsItem {
	constructor(
		public readonly productId: UUID,
		public readonly materialId: UUID,
		public cantidad: number,
		public unidadMedida: string | null,
	) {
		this.validate();
	}

	private validate(): void {
		if (this.cantidad == null || isNaN(this.cantidad) || this.cantidad <= 0) {
			throw new DomainError('La cantidad debe ser un número mayor a 0');
		}
		if (this.unidadMedida !== null && this.unidadMedida.trim().length === 0) {
			this.unidadMedida = null;
		}
	}

	update(fields: Partial<{ cantidad: number; unidadMedida: string | null }>): void {
		if (fields.cantidad !== undefined) this.cantidad = fields.cantidad;
		if (fields.unidadMedida !== undefined) this.unidadMedida = fields.unidadMedida;
		this.validate();
	}
}

