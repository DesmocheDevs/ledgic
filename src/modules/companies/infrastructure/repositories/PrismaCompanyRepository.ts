import type { PrismaClient } from "@prisma/client";
import type { CompanyRepository } from "../../domain/repositories/CompanyRepository";
import type { Company } from "../../domain/entities/Company";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";

@injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({ orderBy: { name: "asc" } });
  }

  async findSuppliers(): Promise<Company[]> {
    return this.prisma.company.findMany({ where: { OR: [{ type: "SUPPLIER" }, { type: "BOTH" }] }, orderBy: { name: "asc" } });
  }

  async create(data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async update(id: string, data: Partial<Omit<Company, "id" | "createdAt" | "updatedAt">>): Promise<Company> {
    return this.prisma.company.update({ where: { id }, data });
  }
}
