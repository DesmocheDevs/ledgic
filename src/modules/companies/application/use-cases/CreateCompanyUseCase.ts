import type { Company } from "../../domain/entities/Company";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository";

type Input = Omit<Company, "id" | "createdAt" | "updatedAt">;

export class CreateCompanyUseCase {
  constructor(private readonly repo: CompanyRepository) {}
  async execute(input: Input): Promise<Company> {
    return this.repo.create(input);
  }
}
