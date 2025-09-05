import type { BomItem } from "../../domain/entities/Bom";
import type { BomRepository } from "../../domain/repositories/BomRepository";

export class UpsertRecipeUseCase {
  constructor(private readonly repo: BomRepository) {}
  async execute(productId: string, items: BomItem[]) {
    // Validaciones mínimas: cantidades positivas
    for (const it of items) if (parseFloat(it.quantity) <= 0) throw new Error("Cantidad inválida en receta");
    return this.repo.upsert(productId, items);
  }
}
