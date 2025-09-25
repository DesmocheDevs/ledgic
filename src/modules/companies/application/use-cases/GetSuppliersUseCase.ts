import type { Company } from "../../domain/entities/Company";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository";

export class GetSuppliersUseCase {
  constructor(private readonly repo: CompanyRepository) {}
  async execute(): Promise<Company[]> {
    return this.repo.findSuppliers();
  }
}
