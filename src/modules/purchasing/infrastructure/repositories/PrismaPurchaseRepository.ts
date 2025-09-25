import { Prisma, type PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../shared/container";
import type { PurchaseRepository } from "../../domain/repositories/PurchaseRepository";
import type { Purchase, PurchaseItem } from "../../domain/entities/Purchase";

@injectable()
export class PrismaPurchaseRepository implements PurchaseRepository {
  constructor(@inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<(Purchase & { items: PurchaseItem[] }) | null> {
    const row = await this.prisma.purchase.findUnique({ where: { id }, include: { items: true } });
    if (!row) return null;
    return {
      id: row.id,
      companyId: row.companyId,
      supplierId: row.supplierId,
      invoiceNumber: row.invoiceNumber,
      totalAmount: row.totalAmount.toString(),
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      items: row.items.map(i => ({
        id: i.id,
        purchaseId: i.purchaseId,
        materialId: i.materialId,
        quantity: i.quantity.toString(),
        unitPrice: i.unitPrice.toString(),
        itemTotal: i.itemTotal.toString(),
      })),
    };
  }

  async listByCompany(companyId: string): Promise<Purchase[]> {
    const rows = await this.prisma.purchase.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
    return rows.map(r => ({
      id: r.id,
      companyId: r.companyId,
      supplierId: r.supplierId,
      invoiceNumber: r.invoiceNumber,
      totalAmount: r.totalAmount.toString(),
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async create(data: Omit<Purchase, "id" | "createdAt" | "updatedAt">, items: Array<Omit<PurchaseItem, "id" | "purchaseId">>): Promise<Purchase & { items: PurchaseItem[] }> {
    const created = await this.prisma.purchase.create({
      include: { items: true },
      data: {
        companyId: data.companyId,
        supplierId: data.supplierId,
        invoiceNumber: data.invoiceNumber ?? null,
        totalAmount: new Prisma.Decimal(data.totalAmount),
        status: data.status,
        items: {
          create: items.map(i => ({
            materialId: i.materialId,
            quantity: new Prisma.Decimal(i.quantity),
            unitPrice: new Prisma.Decimal(i.unitPrice),
            itemTotal: new Prisma.Decimal(i.itemTotal),
          })),
        },
      },
    });
    return {
      id: created.id,
      companyId: created.companyId,
      supplierId: created.supplierId,
      invoiceNumber: created.invoiceNumber,
      totalAmount: created.totalAmount.toString(),
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      items: created.items.map(i => ({
        id: i.id,
        purchaseId: i.purchaseId,
        materialId: i.materialId,
        quantity: i.quantity.toString(),
        unitPrice: i.unitPrice.toString(),
        itemTotal: i.itemTotal.toString(),
      })),
    };
  }

  async update(id: string, data: Partial<Omit<Purchase, "id" | "createdAt" | "updatedAt">>): Promise<Purchase> {
    const updated = await this.prisma.purchase.update({
      where: { id },
      data: {
        ...data,
        totalAmount: data.totalAmount !== undefined ? new Prisma.Decimal(data.totalAmount) : undefined,
      },
    });
    return {
      id: updated.id,
      companyId: updated.companyId,
      supplierId: updated.supplierId,
      invoiceNumber: updated.invoiceNumber,
      totalAmount: updated.totalAmount.toString(),
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async setStatus(id: string, status: Purchase["status"]): Promise<Purchase> {
    const updated = await this.prisma.purchase.update({ where: { id }, data: { status } });
    return {
      id: updated.id,
      companyId: updated.companyId,
      supplierId: updated.supplierId,
      invoiceNumber: updated.invoiceNumber,
      totalAmount: updated.totalAmount.toString(),
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
