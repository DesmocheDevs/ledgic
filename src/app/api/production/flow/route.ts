import "reflect-metadata";
import { container, configureContainer } from "../../../../shared/container";
import { ProductionFlowService } from "../../../../modules/production/application/services/ProductionFlowService";
import { createErrorResponse, createSuccessResponse } from "../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/production/flow:
 *   post:
 *     tags: [Production]
 *     summary: Crear un nuevo flujo de producción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               productId: { type: string }
 *             required: [companyId, productId]
 *     responses:
 *       201: { description: Flujo creado }
 *       400: { description: Error de validación }
 */
export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();
    const { companyId, productId } = body;

    if (!companyId || !productId) {
      return createErrorResponse('companyId y productId son requeridos', 400);
    }

    const flowService = container.resolve(ProductionFlowService);
    const flowId = flowService.createFlow(companyId, productId);

    return createSuccessResponse({
      flowId,
      message: 'Flujo de producción creado correctamente'
    }, 201);

  } catch (error: unknown) {
    console.error('Error en POST /api/production/flow:', error);
    return createErrorResponse("Error interno del servidor", 500);
  }
}
