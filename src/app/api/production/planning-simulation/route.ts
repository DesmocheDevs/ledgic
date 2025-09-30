import "reflect-metadata";
import { container, configureContainer } from "../../../../shared/container";
import { PlanningSimulationService } from "../../../../modules/production/application/services/PlanningSimulationService";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/production/planning-simulation:
 *   post:
 *     tags: [Production]
 *     summary: Simular escenarios de planificación de producción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: number }
 *               startDate: { type: string, format: date }
 *               priority: { type: string, enum: [low, medium, high] }
 *               scenario: { type: string, enum: [optimistic, realistic, conservative] }
 *             required: [productId, quantity]
 *     responses:
 *       200: { description: Resultados de simulación de planificación }
 *       400: { description: Error de validación }
 */
export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();

    const { productId, quantity, startDate, priority = 'medium', scenario = 'realistic' } = body;

    if (!productId || !quantity) {
      return createErrorResponse('productId y quantity son requeridos', 400);
    }

    if (quantity <= 0) {
      return createErrorResponse('La cantidad debe ser mayor a 0', 400);
    }

    const simulationService = container.resolve(PlanningSimulationService);
    const result = await simulationService.simulatePlanning({
      productId,
      quantity,
      startDate: startDate ? new Date(startDate) : undefined,
      priority,
      scenario,
    });

    return createSuccessResponse({
      simulation: {
        feasibility: result.feasibility,
        timeline: {
          ...result.timeline,
          estimatedStart: result.timeline.estimatedStart.toISOString(),
          estimatedEnd: result.timeline.estimatedEnd.toISOString(),
        },
        resources: result.resources,
        costs: result.costs,
        risks: result.risks,
      }
    });
  } catch (error: unknown) {
    console.error('Error en POST /api/production/planning-simulation:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}