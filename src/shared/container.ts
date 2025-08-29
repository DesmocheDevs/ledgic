import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import prisma from "./infrastructure/database/prisma";
import type { ClientRepository } from "../modules/clients/domain/repositories/ClientRepository";
import type { InventoryRepository } from "../modules/inventory/domain";
import type { MaterialRepository } from "../modules/inventory/domain/repositories/MaterialRepository";
import type { ProductRepository } from "../modules/products/domain";

// Tokens para inyección de dependencias
export const TOKENS = {
  PrismaClient: "PrismaClient",
  ClientRepository: "ClientRepository",
  InventoryRepository: "InventoryRepository",
  MaterialRepository: "MaterialRepository",
  ProductRepository: "ProductRepository",
} as const;

let isContainerConfigured = false;

export async function configureContainer(): Promise<void> {
  if (isContainerConfigured) return;
  try {
    // Registrar dependencias de infraestructura
    container.registerInstance<PrismaClient>(TOKENS.PrismaClient, prisma);

    // Import dinámico para evitar ciclos y cumplir reglas ESM
    const { PrismaClientRepository } = await import("../modules/clients/infrastructure");
    const { PrismaInventoryRepository } = await import("../modules/inventory/infrastructure");
    const { PrismaMaterialRepository } = await import("../modules/inventory/infrastructure");
    const { PrismaProductRepository } = await import("../modules/products/infrastructure");

    // Registrar repositorios con tipado fuerte
    container.register<ClientRepository>(TOKENS.ClientRepository, {
      useClass: PrismaClientRepository,
    });

    container.register<InventoryRepository>(TOKENS.InventoryRepository, {
      useClass: PrismaInventoryRepository,
    });

    container.register<MaterialRepository>(TOKENS.MaterialRepository, {
      useClass: PrismaMaterialRepository,
    });

    container.register<ProductRepository>(TOKENS.ProductRepository, {
      useClass: PrismaProductRepository,
    });

    isContainerConfigured = true;
  } catch (error) {
    console.error("Error configurando el contenedor de dependencias:", error);
    throw new Error("Falló la configuración del contenedor de dependencias");
  }
}

export { container };