import "reflect-metadata";
import { container, configureContainer, TOKENS } from "../../../../shared/container";
import { UpsertBOMUseCase } from "../../../../modules/bom/application/use-cases/UpsertBOMUseCase";
import type { BomRepository } from "../../../../modules/bom/domain/repositories/BomRepository";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../shared/infrastructure/utils/errorResponse";
import { z } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UpsertBOMSchema = z.object({
  items: z.array(z.object({
    productId: z.string().optional(), // Will be set from path
    materialId: z.string(),
    quantity: z.string(),
    unitOfMeasure: z.string().optional(),
  })),
});

/**
 * @swagger
 * /api/bom/{productId}:
 *   get:
 *     tags: [BOM]
 *     summary: Obtener lista de materiales para un producto
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Producto no encontrado }
 */
export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    await configureContainer();
    const { productId } = await params;

    const bomRepo = container.resolve<BomRepository>(TOKENS.BomRepository);
    const items = await bomRepo.getByProduct(productId);

    return createSuccessResponse(items);
  } catch (error: unknown) {
    console.error('Error en GET /api/bom/[productId]:', error);
    return createErrorResponse('No se pudo obtener la BOM', 500);
  }
}

/**
 * @swagger
 * /api/bom/{productId}:
 *   put:
 *     tags: [BOM]
 *     summary: Actualizar lista de materiales para un producto
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items: { type: array, items: { type: object } }
 *             required: [items]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */
export async function PUT(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    await configureContainer();
    const { productId } = await params;
    const body = await req.json();

    // Validar con zod
    const validation = UpsertBOMSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('Datos inválidos: ' + validation.error.message, 400);
    }

    const useCase = container.resolve(UpsertBOMUseCase);
    const itemsWithProductId = validation.data.items.map(item => ({
      ...item,
      productId,
    }));
    await useCase.execute(productId, itemsWithProductId);

    return createSuccessResponse({ message: "BOM actualizada correctamente" });
  } catch (error: unknown) {
    console.error('Error en PUT /api/bom/[productId]:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}
