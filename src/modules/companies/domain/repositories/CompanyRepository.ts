import type { Company } from "../entities/Company";

export interface CompanyRepository {
  findById(id: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  findSuppliers(): Promise<Company[]>;
  create(data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company>;
  update(id: string, data: Partial<Omit<Company, "id" | "createdAt" | "updatedAt">>): Promise<Company>;
}
