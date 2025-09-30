import "reflect-metadata";
import { container, configureContainer } from "../../../../../shared/container";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProductionOperation {
  operationName: string;
  quantity: number;
  hoursWorked: number;
  workersCount: number;
  notes?: string;
}

/**
 * @swagger
 * /api/lots/{id}/operations:
 *   post:
 *     tags: [Production]
 *     summary: Registrar operación de producción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operationName: { type: string }
 *               quantity: { type: number }
 *               hoursWorked: { type: number }
 *               workersCount: { type: number }
 *               notes: { type: string }
 *             required: [operationName, quantity, hoursWorked, workersCount]
 *     responses:
 *       200: { description: Operación registrada correctamente }
 *       400: { description: Error de validación }
 *       404: { description: Lote no encontrado }
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await configureContainer();
    const body = await req.json();
    const { operationName, quantity, hoursWorked, workersCount, notes }: ProductionOperation = body;

    if (!operationName || !quantity || !hoursWorked || !workersCount) {
      return createErrorResponse('Todos los campos son requeridos: operationName, quantity, hoursWorked, workersCount', 400);
    }

    if (quantity <= 0 || hoursWorked <= 0 || workersCount <= 0) {
      return createErrorResponse('quantity, hoursWorked y workersCount deben ser mayores a 0', 400);
    }

    // Calcular costo de la operación
    const hourlyRate = 12.50; // Tarifa por hora estándar
    const operationCost = hoursWorked * workersCount * hourlyRate;

    // Aquí iría la lógica real para registrar la operación
    // Por ahora, devolveremos una respuesta simulada
    const operation = {
      id: `op_${Date.now()}`,
      lotId: params.id,
      operationName,
      quantity,
      hoursWorked,
      workersCount,
      operationCost,
      unitCost: operationCost / quantity,
      notes,
      timestamp: new Date().toISOString(),
    };

    return createSuccessResponse({
      operation,
      message: `Operación "${operationName}" registrada correctamente`
    });

  } catch (error: unknown) {
    console.error('Error en POST /api/lots/[id]/operations:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}

/**
 * @swagger
 * /api/lots/{id}/operations:
 *   get:
 *     tags: [Production]
 *     summary: Obtener operaciones de un lote de producción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Lista de operaciones }
 *       404: { description: Lote no encontrado }
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await configureContainer();

    // Aquí iría la lógica real para obtener operaciones del lote
    // Por ahora, devolveremos una respuesta simulada
    const operations = [
      {
        id: 'op_1',
        lotId: params.id,
        operationName: 'Corte de cuero',
        quantity: 100,
        hoursWorked: 8,
        workersCount: 2,
        operationCost: 200,
        unitCost: 2,
        notes: 'Operación completada sin problemas',
        timestamp: new Date().toISOString(),
      }
    ];

    return createSuccessResponse({
      lotId: params.id,
      operations,
      totalOperations: operations.length,
    });

  } catch (error: unknown) {
    console.error('Error en GET /api/lots/[id]/operations:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}