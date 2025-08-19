import "reflect-metadata";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import prisma from "./infrastructure/database/prisma";

// Tokens para inyección de dependencias
export const TOKENS = {
  PrismaClient: "PrismaClient",
  ClientRepository: "ClientRepository",
} as const;

let isContainerConfigured = false;

export function configureContainer(): void {
  if (isContainerConfigured) {
    return;
  }

  try {
    // Registrar dependencias de infraestructura
    container.registerInstance<PrismaClient>(TOKENS.PrismaClient, prisma);

    // Importar dinámicamente para evitar dependencias circulares
    const { PrismaClientRepository } = require("../modules/clients/infrastructure");
    
    // Registrar repositorios
    container.register<any>(
      TOKENS.ClientRepository,
      { useClass: PrismaClientRepository }
    );

    isContainerConfigured = true;
  } catch (error) {
    console.error("Error configurando el contenedor de dependencias:", error);
    throw new Error("Falló la configuración del contenedor de dependencias");
  }
}

export { container };