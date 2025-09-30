import type { ProductionRepository } from "../../domain/repositories/ProductionRepository";

export class GetLotUseCase {
  constructor(private readonly repo: ProductionRepository) {}

  async execute(lotId: string) {
    return this.repo.getLot(lotId);
  }
}