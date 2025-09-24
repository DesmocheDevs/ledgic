import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import prisma from "./infrastructure/database/prisma";
import type { InventoryRepository } from "../modules/inventory/domain";
import type { MaterialRepository } from "../modules/inventory/domain/repositories/MaterialRepository";
import type { ProductRepository } from "../modules/products/domain";
import type { CompanyRepository } from "../modules/companies/domain";
import type { PurchaseRepository } from "../modules/purchasing/domain/repositories/PurchaseRepository";
import type { LedgerRepository } from "../modules/ledger/domain/repositories/LedgerRepository";
import type { WacService } from "../modules/ledger/domain/services/WacService";
import type { ProductionRepository } from "../modules/production/domain/repositories/ProductionRepository";
import type { BomRepository } from "../modules/bom/domain/repositories/BomRepository";
import type { LotRepository } from "../modules/production/domain/repositories/LotRepository";

// Tokens para inyección de dependencias
export const TOKENS = {
  PrismaClient: "PrismaClient",
  InventoryRepository: "InventoryRepository",
  MaterialRepository: "MaterialRepository",
  ProductRepository: "ProductRepository",
  CompanyRepository: "CompanyRepository",
  PurchaseRepository: "PurchaseRepository",
  LedgerRepository: "LedgerRepository",
  WacService: "WacService",
  ProductionRepository: "ProductionRepository",
  BomRepository: "BomRepository",
  LotRepository: "LotRepository",
} as const;

let isContainerConfigured = false;

export async function configureContainer(): Promise<void> {
  if (isContainerConfigured) return;
  try {
    // Registrar dependencias de infraestructura
    container.registerInstance<PrismaClient>(TOKENS.PrismaClient, prisma);

    // Import dinámico para evitar ciclos y cumplir reglas ESM
  const { PrismaInventoryRepository } = await import("../modules/inventory/infrastructure");
  const { PrismaMaterialRepository } = await import("../modules/inventory/infrastructure");
  const { PrismaProductRepository } = await import("../modules/products/infrastructure");
  const { PrismaCompanyRepository } = await import("../modules/companies/infrastructure");
  const { PrismaPurchaseRepository } = await import("../modules/purchasing/infrastructure/repositories/PrismaPurchaseRepository");
  const { PrismaLedgerRepository, PrismaWacService } = await import("../modules/ledger/infrastructure");
  const { PrismaProductionRepository } = await import("../modules/production/infrastructure/repositories/PrismaProductionRepository");
  const { PrismaLotRepository } = await import("../modules/production/infrastructure/repositories/PrismaLotRepository");
  const { PrismaBomRepository } = await import("../modules/bom/infrastructure/repositories/PrismaBomRepository");

    // Registrar repositorios con tipado fuerte
  // Clients module removed

    container.register<InventoryRepository>(TOKENS.InventoryRepository, {
      useClass: PrismaInventoryRepository,
    });

    container.register<MaterialRepository>(TOKENS.MaterialRepository, {
      useClass: PrismaMaterialRepository,
    });

    container.register<ProductRepository>(TOKENS.ProductRepository, {
      useClass: PrismaProductRepository,
    });

    container.register<CompanyRepository>(TOKENS.CompanyRepository, {
      useClass: PrismaCompanyRepository,
    });
    container.register<PurchaseRepository>(TOKENS.PurchaseRepository, {
      useClass: PrismaPurchaseRepository,
    });
    container.register<LedgerRepository>(TOKENS.LedgerRepository, {
      useClass: PrismaLedgerRepository,
    });
    container.register<WacService>(TOKENS.WacService, {
      useClass: PrismaWacService,
    });
    container.register<ProductionRepository>(TOKENS.ProductionRepository, {
      useClass: PrismaProductionRepository,
    });
    container.register<BomRepository>(TOKENS.BomRepository, {
      useClass: PrismaBomRepository,
    });
    container.register<LotRepository>(TOKENS.LotRepository, {
      useClass: PrismaLotRepository,
    });

    isContainerConfigured = true;
  } catch (error) {
    console.error("Error configurando el contenedor de dependencias:", error);
    throw new Error("Falló la configuración del contenedor de dependencias");
  }
}

export { container };
