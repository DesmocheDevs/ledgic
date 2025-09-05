import { Prisma, type PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";
import type { ProductionRepository } from "../../domain/repositories/ProductionRepository";
import type { ProductionLot } from "../../domain/entities/Production";

@injectable()
export class PrismaProductionRepository implements ProductionRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async createLot(data: Omit<ProductionLot, "id" | "createdAt" | "updatedAt" | "producedQuantity" | "status">): Promise<ProductionLot> {
    const row = await this.prisma.productionLot.create({
      data: {
        companyId: data.companyId,
        productId: data.productId,
        lotCode: data.lotCode,
        plannedQuantity: new Prisma.Decimal(data.plannedQuantity),
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        status: "PLANNED",
      },
    });
    return {
      id: row.id,
      companyId: row.companyId,
      productId: row.productId,
      lotCode: row.lotCode,
      plannedQuantity: row.plannedQuantity.toString(),
      producedQuantity: row.producedQuantity.toString(),
      unitCost: row.unitCost?.toString() ?? null,
      totalCost: row.totalCost?.toString() ?? null,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async getLot(id: string) {
    const row = await this.prisma.productionLot.findUnique({ where: { id } });
    return row
      ? {
          id: row.id,
          companyId: row.companyId,
          productId: row.productId,
          lotCode: row.lotCode,
          plannedQuantity: row.plannedQuantity.toString(),
          producedQuantity: row.producedQuantity.toString(),
          unitCost: row.unitCost?.toString() ?? null,
          totalCost: row.totalCost?.toString() ?? null,
          startDate: row.startDate,
          endDate: row.endDate,
          status: row.status,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        }
      : null;
  }

  async listLots(companyId: string) {
    const rows = await this.prisma.productionLot.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
    return rows.map(row => ({
      id: row.id,
      companyId: row.companyId,
      productId: row.productId,
      lotCode: row.lotCode,
      plannedQuantity: row.plannedQuantity.toString(),
      producedQuantity: row.producedQuantity.toString(),
      unitCost: row.unitCost?.toString() ?? null,
      totalCost: row.totalCost?.toString() ?? null,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  async setStatus(id: string, status: ProductionLot["status"]) {
    await this.prisma.productionLot.update({ where: { id }, data: { status } });
  }

  async addConsumption(lotId: string, materialId: string, quantity: string, unitCost: string) {
    const row = await this.prisma.lotMaterialConsumption.create({
      data: {
        productionLotId: lotId,
        materialId,
        quantity: new Prisma.Decimal(quantity),
        unitCost: new Prisma.Decimal(unitCost),
        totalCost: new Prisma.Decimal(new Prisma.Decimal(quantity).mul(unitCost)),
      },
    });
    return {
      id: row.id,
      productionLotId: row.productionLotId,
      materialId: row.materialId,
      quantity: row.quantity.toString(),
      unitCost: row.unitCost.toString(),
      totalCost: row.totalCost.toString(),
    };
  }

  async declareProduction(lotId: string, producedQuantity: string, unitCost: string) {
    await this.prisma.productionLot.update({
      where: { id: lotId },
      data: {
        producedQuantity: new Prisma.Decimal(producedQuantity),
        unitCost: new Prisma.Decimal(unitCost),
        totalCost: new Prisma.Decimal(new Prisma.Decimal(producedQuantity).mul(unitCost)),
        status: "COMPLETED",
        endDate: new Date(),
      },
    });
  }
}
