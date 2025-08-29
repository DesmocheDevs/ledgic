import { injectable, inject } from 'tsyringe';
import type { ProductRepository } from '../../domain';
import { ProductMaterial } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export interface SetProductMaterialsRequestItem {
  materialId: string;
  cantidad: number;
  unidadMedida?: string | null;
}

@injectable()
export class SetProductMaterialsUseCase {
  constructor(@inject(TOKENS.ProductRepository) private readonly repository: ProductRepository) {}

  async execute(productId: string, items: SetProductMaterialsRequestItem[]): Promise<void> {
    const pid = UUID.fromString(productId);
    const product = await this.repository.findById(pid);
    if (!product) throw new DomainError('Producto no encontrado');

    // Validaciones básicas
    if (!Array.isArray(items)) {
      throw new DomainError('Debe enviar un arreglo de materiales');
    }
    const seen = new Set<string>();
    for (const it of items) {
      if (typeof it.cantidad !== 'number' || it.cantidad <= 0) {
        throw new DomainError('cantidad debe ser un número > 0');
      }
      if (it.unidadMedida !== undefined && it.unidadMedida !== null && it.unidadMedida.length > 50) {
        throw new DomainError('unidadMedida no puede exceder 50 caracteres');
      }
      const mid = UUID.fromString(it.materialId).getValue();
      if (seen.has(mid)) throw new DomainError('No se permiten materiales duplicados');
      seen.add(mid);
    }

    const entities = items.map((m) => new ProductMaterial(
      pid,
      UUID.fromString(m.materialId),
      m.cantidad,
      m.unidadMedida ?? null,
    ));

    await this.repository.setMaterials(pid, entities);
  }
}
