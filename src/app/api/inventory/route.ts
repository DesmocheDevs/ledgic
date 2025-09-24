import "reflect-metadata";
import { Prisma } from "@prisma/client";
import { container, configureContainer } from "../../../shared/container";
import { GetAllInventoryUseCase, CreateInventoryUseCase } from "../../../modules/inventory/application/use-cases";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";

// Asegura runtime Node y evita cualquier intento de prerender
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Lista inventario
 *     responses:
 *       200:
 *         description: OK
 */
export async function GET() {
  try {
    await configureContainer();
    const useCase = container.resolve(GetAllInventoryUseCase);
    const inventories = await useCase.execute();
    
    const response = inventories.map((inventory) => ({
      id: inventory.id.getValue(),
      nombre: inventory.nombre,
      categoria: inventory.categoria,
      estado: inventory.estado,
      unidadMedida: inventory.unidadMedida,
      proveedor: inventory.proveedor,
      tipo: inventory.tipo,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    }));
    
    return createSuccessResponse(response);
  } catch (error: unknown) {
    console.error('Error en GET /api/inventory:', error);
    return createErrorResponse('No se pudieron obtener los inventarios', 500);
  }
}

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     tags: [Inventory]
 *     summary: Crea un ítem de inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               name: { type: string }
 *               category: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE, OBSOLETE] }
 *               unitOfMeasure: { type: string }
 *               itemType: { type: string, enum: [PRODUCT, MATERIAL] }
 *             required: [companyId, name, category, status, unitOfMeasure, itemType]
 *     responses:
 *       201: { description: Creado }
 *       400: { description: Error de validación }
 *       409: { description: Conflicto de unicidad }
 */
export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();

    // Accept legacy Spanish fields and new English ones; require companyId and itemType
    const name: string | undefined = body.nombre ?? body.name;
    const category: string | undefined = body.categoria ?? body.category;
    const unitOfMeasure: string | undefined = body.unidadMedida ?? body.unitOfMeasure;
    const companyId: string | undefined = body.companyId;
    const rawItemType: string | undefined = body.itemType ?? body.tipo;
    const rawStatus: string | undefined = body.status ?? body.estado;

    // Validate required
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return createErrorResponse('Campo inválido o faltante: name/nombre', 400);
    }
    if (!category || typeof category !== 'string' || category.trim().length < 2) {
      return createErrorResponse('Campo inválido o faltante: category/categoria', 400);
    }
    if (!unitOfMeasure || typeof unitOfMeasure !== 'string' || unitOfMeasure.trim().length === 0 || unitOfMeasure.length > 50) {
      return createErrorResponse('Campo inválido o faltante: unitOfMeasure/unidadMedida', 400);
    }
    if (!companyId || typeof companyId !== 'string' || companyId.trim().length === 0) {
      return createErrorResponse('Campo inválido o faltante: companyId', 400);
    }
    if (!rawItemType || typeof rawItemType !== 'string') {
      return createErrorResponse('Campo inválido o faltante: itemType/tipo', 400);
    }

    // Map status to English enum
    let status: 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
    if (rawStatus === 'ACTIVE' || rawStatus === 'INACTIVE' || rawStatus === 'OBSOLETE') {
      status = rawStatus;
    } else if (rawStatus === 'ACTIVO') {
      status = 'ACTIVE';
    } else if (rawStatus === 'INACTIVO') {
      status = 'INACTIVE';
    } else if (rawStatus === 'DESCONTINUADO') {
      status = 'OBSOLETE';
    } else {
      return createErrorResponse('Estado/Status inválido', 400);
    }

    // Map itemType to English enum
    let itemType: 'PRODUCT' | 'MATERIAL';
    if (rawItemType === 'PRODUCT' || rawItemType === 'MATERIAL') {
      itemType = rawItemType;
    } else if (rawItemType.toUpperCase() === 'PRODUCTO') {
      itemType = 'PRODUCT';
    } else if (rawItemType.toUpperCase() === 'MATERIAL') {
      itemType = 'MATERIAL';
    } else {
      return createErrorResponse('itemType/tipo inválido', 400);
    }

    const useCase = container.resolve(CreateInventoryUseCase);
    const inventory = await useCase.execute({
      companyId,
      name,
      category,
      status,
      unitOfMeasure,
      itemType,
    });

    // Solo si no hubo excepción, se construye y retorna la respuesta
    return createSuccessResponse({
      id: inventory.id.getValue(),
  nombre: inventory.nombre,
  categoria: inventory.categoria,
  estado: inventory.estado,
  unidadMedida: inventory.unidadMedida,
  tipo: inventory.tipo,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    }, 201);

  } catch (error: unknown) {
    console.error('Error en POST /api/inventory:', error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    // Errores de dominio
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    // Errores de Prisma (violación de unicidad u otros)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") ?? "desconocido";
        const errorMessage = `Ya existe un inventario con este ${target}`;
        return createErrorResponse(errorMessage, 409);
      }
    }

    // Otros errores
    return createErrorResponse("Error interno del servidor", 500);
  }
}