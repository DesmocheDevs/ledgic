import type { Company } from "../../domain/entities/Company";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository";

type Update = Partial<Omit<Company, "id" | "createdAt" | "updatedAt">>;

export class UpdateCompanyUseCase {
  constructor(private readonly repo: CompanyRepository) {}
  async execute(id: string, update: Update): Promise<Company> {
    return this.repo.update(id, update);
  }
}
