import "reflect-metadata";
import { container, configureContainer } from "../../../../shared/container";
import { ProductionSimulationService } from "../../../../modules/production/application/services/ProductionSimulationService";
import { DomainError } from "../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/production/simulation:
 *   post:
 *     tags: [Production]
 *     summary: Simular escenarios de producción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: number }
 *               scenarioId: { type: string, enum: [optimistic, realistic, conservative] }
 *             required: [productId, quantity]
 *     responses:
 *       200: { description: Resultados de simulación }
 *       400: { description: Error de validación }
 */
export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();

    const { productId, quantity, scenarioId = 'realistic' } = body;

    if (!productId || !quantity) {
      return createErrorResponse('productId y quantity son requeridos', 400);
    }

    if (quantity <= 0) {
      return createErrorResponse('La cantidad debe ser mayor a 0', 400);
    }

    const simulationService = container.resolve(ProductionSimulationService);
    const result = await simulationService.simulateProduction(productId, quantity, scenarioId);

    return createSuccessResponse({
      simulation: {
        scenario: result.scenario,
        results: result.results,
      }
    });
  } catch (error: unknown) {
    console.error('Error en POST /api/production/simulation:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}

/**
 * @swagger
 * /api/production/simulation/scenarios:
 *   get:
 *     tags: [Production]
 *     summary: Obtener escenarios de simulación disponibles
 *     responses:
 *       200: { description: Lista de escenarios disponibles }
 */
export async function GET(req: Request) {
  try {
    await configureContainer();

    const simulationService = container.resolve(ProductionSimulationService);
    const scenarios = simulationService.getAvailableScenarios();

    return createSuccessResponse({
      scenarios: scenarios.map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        parameters: scenario.parameters,
      }))
    });
  } catch (error: unknown) {
    console.error('Error en GET /api/production/simulation/scenarios:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}