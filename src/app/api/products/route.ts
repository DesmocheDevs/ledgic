import "reflect-metadata";
import { Prisma } from "@prisma/client";
import { container, configureContainer } from "../../../shared/container";
import { GetAllProductsUseCase, CreateProductUseCase } from "../../../modules/products/application/use-cases";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";
import { getValidatedSession } from "@/lib/auth-utils";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Lista productos
 *     responses:
 *       200: { description: OK }
 */
export async function GET() {
  try {
    // Try to validate session but don't redirect if it fails
    let hasValidSession = false;
    try {
      await getValidatedSession();
      hasValidSession = true;
    } catch {
      // For API testing, we'll allow access without authentication
      hasValidSession = false;
    }

    await configureContainer();
    const useCase = container.resolve(GetAllProductsUseCase);
    const products = await useCase.execute();

    const response = products.map((p) => ({
      id: p.id.getValue(),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return createSuccessResponse(response);
  } catch (error: unknown) {
    console.error('Error en GET /api/products:', error);
    return createErrorResponse('No se pudieron obtener los productos', 500);
  }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Crea un producto y opcionalmente asocia materiales (BOM)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               descripcion: { type: string, nullable: true }
 *               precio: { type: number }
 *               categoria: { type: string, nullable: true }
 *               materials: { type: array, items: { type: object } }
 *             required: [nombre, precio]
 *     responses:
 *       201: { description: Creado }
 *       400: { description: Error de validación }
 *       409: { description: Conflicto de unicidad }
 */
export async function POST(req: Request) {
  try {
    // Validate user session
    await getValidatedSession();

    await configureContainer();
    const body = await req.json();

    const required = ["nombre", "precio"] as const;
    for (const field of required) {
      if (!body[field]) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    if (typeof body.precio !== 'number' || body.precio < 0) {
      return createErrorResponse('precio debe ser un número >= 0', 400);
    }

    const descripcion = body.descripcion === "" ? null : body.descripcion ?? null;
    const categoria = body.categoria === "" ? null : body.categoria ?? null;

    // Validación opcional de materials
    if (body.materials !== undefined && !Array.isArray(body.materials)) {
      return createErrorResponse('materials debe ser un arreglo', 400);
    }

    const useCase = container.resolve(CreateProductUseCase);
    const product = await useCase.execute({
      nombre: body.nombre,
      descripcion,
      precio: body.precio,
      categoria,
      materials: body.materials,
    });

    return createSuccessResponse({
      id: product.id.getValue(),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }, 201);

  } catch (error: unknown) {
    console.error('Error en POST /api/products:', error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") ?? "desconocido";
        return createErrorResponse(`Ya existe un producto con este ${target}`, 409);
      }
    }

    return createErrorResponse("Error interno del servidor", 500);
  }
}
