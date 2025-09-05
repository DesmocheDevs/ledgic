import type { Company } from "../../domain/entities/Company";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository";

export class GetAllCompaniesUseCase {
  constructor(private readonly repo: CompanyRepository) {}
  async execute(): Promise<Company[]> {
    return this.repo.findAll();
  }
}
