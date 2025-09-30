import "reflect-metadata";
import { Prisma } from "@prisma/client";
import { container, configureContainer, TOKENS } from "../../../shared/container";
import type { PrismaClient } from "@prisma/client";
import { GetAllMaterialsUseCase, CreateMaterialUseCase } from "../../../modules/inventory/application/use-cases";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";
import { getValidatedSession } from "@/lib/auth-utils";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/materials:
 *   get:
 *     tags: [Materials]
 *     summary: Lista materiales
 *     responses:
 *       200:
 *         description: OK
 */
export async function GET() {
  try {
    // Validate user session
    await getValidatedSession();

    await configureContainer();
    const useCase = container.resolve(GetAllMaterialsUseCase);
    const materials = await useCase.execute();

  // Usa el PrismaClient del contenedor (evita require y múltiples instancias)
  const prisma = container.resolve<PrismaClient>(TOKENS.PrismaClient);

    const response = await Promise.all(materials.map(async (m) => {
      const inventoryData = await prisma.inventory.findUnique({
        where: { id: m.inventarioId.getValue() }
      });

      return {
        id: m.id.getValue(),
        precioCompra: m.precioCompra,
        proveedor: m.proveedor,
        cantidadActual: m.cantidadActual,
        valorTotalInventario: m.valorTotalInventario,
        costoPromedioPonderado: m.costoPromedioPonderado,
        inventarioId: m.inventarioId.getValue(),
        inventario: inventoryData ? {
          id: inventoryData.id,
          nombre: inventoryData.name,
          categoria: inventoryData.category,
          estado: inventoryData.status,
          unidadMedida: inventoryData.unitOfMeasure,
        } : null,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      };
    }));

    return createSuccessResponse(response);
  } catch (error: unknown) {
    console.error('Error en GET /api/materials:', error);
    return createErrorResponse('No se pudieron obtener los materiales', 500);
  }
}

/**
 * @swagger
 * /api/materials:
 *   post:
 *     tags: [Materials]
 *     summary: Crea detalles de material para un inventario MATERIAL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precioCompra: { type: number }
 *               proveedor: { type: string, nullable: true }
 *               inventarioId: { type: string }
 *             required: [precioCompra, inventarioId]
 *     responses:
 *       201: { description: Creado }
 *       400: { description: Error de validación }
 *       409: { description: Conflicto (FK) }
 */
export async function POST(req: Request) {
  try {
    // Validate user session
    await getValidatedSession();

    await configureContainer();
    const body = await req.json();

    // Validación básica del payload
    const required = ["precioCompra", "inventarioId"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    if (typeof body.precioCompra !== 'number' || body.precioCompra < 0) {
      return createErrorResponse('precioCompra debe ser un número >= 0', 400);
    }

    if (body.proveedor !== undefined && body.proveedor !== null && typeof body.proveedor !== 'string') {
      return createErrorResponse('proveedor debe ser string o null', 400);
    }

    const proveedor = body.proveedor === "" ? null : body.proveedor ?? null;

    const useCase = container.resolve(CreateMaterialUseCase);
    const material = await useCase.execute({
      precioCompra: body.precioCompra,
      proveedor,
      inventarioId: body.inventarioId,
    });

    return createSuccessResponse({
      id: material.id.getValue(),
      precioCompra: material.precioCompra,
      proveedor: material.proveedor,
      inventarioId: material.inventarioId.getValue(),
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    }, 201);

  } catch (error: unknown) {
    console.error('Error en POST /api/materials:', error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") { // FK constraint failed
        return createErrorResponse('inventarioId no existe', 409);
      }
    }

    return createErrorResponse("Error interno del servidor", 500);
  }
}
