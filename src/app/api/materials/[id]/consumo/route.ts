import "reflect-metadata";
import { container, configureContainer } from "../../../../../shared/container";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";
import { RegisterConsumptionUseCase } from "../../../../../modules/production/application/use-cases";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/materials/{id}/consumo:
 *   post:
 *     tags: [Production]
 *     summary: Registra consumo de un material en un lote de producción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               lote_id: { type: string }
 *               cantidad_consumida: { type: number }
 *             required: [companyId, lote_id, cantidad_consumida]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await configureContainer();
    const { id } = await params;
    const body = await req.json();

    // Validación básica del payload
  const required = ["cantidad_consumida", "lote_id", "companyId"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validar tipos y valores
    if (typeof body.cantidad_consumida !== 'number' || body.cantidad_consumida <= 0) {
      return createErrorResponse('cantidad_consumida debe ser un número mayor a 0', 400);
    }

    if (typeof body.lote_id !== 'string' || body.lote_id.trim().length === 0) {
      return createErrorResponse('lote_id debe ser una cadena de texto válida', 400);
    }
    if (typeof body.companyId !== 'string' || body.companyId.trim().length === 0) {
      return createErrorResponse('companyId debe ser una cadena de texto válida', 400);
    }

    // Ejecutar caso de uso de producción (consumo)
    const useCase = container.resolve(RegisterConsumptionUseCase);
    await useCase.execute({
      lotId: body.lote_id,
      materialId: id,
      companyId: body.companyId,
      quantity: String(body.cantidad_consumida),
    });

    // Preparar respuesta
  const response = { ok: true, lotId: body.lote_id, materialId: id };

    return createSuccessResponse(response, 200);

  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/materials/${id}/consumo:`, error);
    
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    return createErrorResponse("Error interno del servidor", 500);
  }
}