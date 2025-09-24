import "reflect-metadata";
import { container, configureContainer, TOKENS } from "../../../shared/container";
import { CreateLotUseCase } from "../../../modules/production/application/use-cases/CreateLotUseCase";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";
import { CreateLotSchema } from "../../../shared/validation/production";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/lots:
 *   post:
 *     tags: [Production]
 *     summary: Crear lote de producción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               productId: { type: string }
 *               lotCode: { type: string }
 *               plannedQuantity: { type: string }
 *             required: [companyId, productId, lotCode, plannedQuantity]
 *     responses:
 *       201: { description: Creado }
 *       400: { description: Error de validación }
 */
export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();

    // Validar con zod
    const validation = CreateLotSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('Datos inválidos: ' + validation.error.message, 400);
    }

    const useCase = container.resolve(CreateLotUseCase);
    const result = await useCase.execute(validation.data);

    return createSuccessResponse({
      lot: {
        id: result.lot.id.getValue(),
        lotCode: result.lot.lotCode,
        status: result.lot.status,
      },
      requirements: result.requirements,
    }, 201);
  } catch (error: unknown) {
    console.error('Error en POST /api/lots:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}
