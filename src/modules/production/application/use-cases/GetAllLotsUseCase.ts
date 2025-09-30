import type { ProductionRepository } from "../../domain/repositories/ProductionRepository";

export class GetAllLotsUseCase {
  constructor(private readonly repo: ProductionRepository) {}

  async execute(companyId: string) {
    return this.repo.listLots(companyId);
  }
}