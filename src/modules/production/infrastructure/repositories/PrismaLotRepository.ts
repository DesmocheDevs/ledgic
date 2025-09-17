import { type PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";
import type { LotRepository } from "../../domain/repositories/LotRepository";
import { ProductionLot } from "../../domain/entities/ProductionLot";
import { UUID } from "../../../../shared/domain/value-objects/UUID";

@injectable()
export class PrismaLotRepository implements LotRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async create(lot: ProductionLot): Promise<ProductionLot> {
    await this.prisma.productionLot.create({
      data: {
        id: lot.id.getValue(),
        companyId: lot.companyId.getValue(),
        productId: lot.productId.getValue(),
        lotCode: lot.lotCode,
        plannedQuantity: lot.plannedQuantity,
        producedQuantity: lot.producedQuantity,
        unitCost: lot.unitCost ? lot.unitCost : null,
        totalCost: lot.totalCost ? lot.totalCost : null,
        startDate: lot.startDate,
        endDate: lot.endDate,
        status: lot.status,
        createdAt: lot.createdAt,
        updatedAt: lot.updatedAt,
      },
    });
    return lot;
  }

  async findById(lotId: string): Promise<ProductionLot | null> {
    const row = await this.prisma.productionLot.findUnique({
      where: { id: lotId },
    });

    if (!row) return null;

    return new ProductionLot(
      UUID.fromString(row.id),
      UUID.fromString(row.companyId),
      UUID.fromString(row.productId),
      row.lotCode,
      row.plannedQuantity.toString(),
      row.producedQuantity.toString(),
      row.createdAt,
      row.updatedAt,
      row.status as any,
      row.startDate || undefined,
      row.endDate || undefined,
      row.unitCost?.toString(),
      row.totalCost?.toString(),
    );
  }

  async toInProgress(lotId: string, date?: Date): Promise<void> {
    await this.prisma.productionLot.update({
      where: { id: lotId },
      data: {
        status: "IN_PROGRESS",
        startDate: date || new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async finish(lotId: string, producedQuantity: string, unitCost: string, totalCost: string, endDate?: Date): Promise<void> {
    await this.prisma.productionLot.update({
      where: { id: lotId },
      data: {
        status: "COMPLETED",
        producedQuantity: producedQuantity,
        unitCost: unitCost,
        totalCost: totalCost,
        endDate: endDate || new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
