import type { Purchase, PurchaseItem } from "../entities/Purchase";

export interface PurchaseRepository {
  findById(id: string): Promise<(Purchase & { items: PurchaseItem[] }) | null>;
  listByCompany(companyId: string): Promise<Purchase[]>;
  create(
    data: Omit<Purchase, "id" | "createdAt" | "updatedAt">,
    items: Array<Omit<PurchaseItem, "id" | "purchaseId">>
  ): Promise<Purchase & { items: PurchaseItem[] }>;
  update(id: string, data: Partial<Omit<Purchase, "id" | "createdAt" | "updatedAt">>): Promise<Purchase>;
  setStatus(id: string, status: Purchase["status"]): Promise<Purchase>;
}
