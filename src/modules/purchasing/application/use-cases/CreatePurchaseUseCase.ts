import type { Purchase, PurchaseItem } from "../../domain/entities/Purchase";
import type { PurchaseRepository } from "../../domain/repositories/PurchaseRepository";

type Input = { data: Omit<Purchase, "id" | "createdAt" | "updatedAt" | "status">; items: Array<Omit<PurchaseItem, "id" | "purchaseId">> };

export class CreatePurchaseUseCase {
  constructor(private readonly repo: PurchaseRepository) {}
  async execute(input: Input) {
    return this.repo.create({ ...input.data, status: "PENDING" }, input.items);
  }
}
