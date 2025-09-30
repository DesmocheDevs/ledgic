import "reflect-metadata";
import { container, configureContainer } from "../../../../../shared/container";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface MaterialConsumption {
  materialId: string;
  quantity: number;
  unitCost?: number;
}

/**
 * @swagger
 * /api/lots/{id}/consume-materials:
 *   post:
 *     tags: [Production]
 *     summary: Consumir materiales para un lote de producción
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
 *               materials: { type: array, items: { type: object, properties: { materialId: { type: string }, quantity: { type: number } } } }
 *             required: [materials]
 *     responses:
 *       200: { description: Materiales consumidos correctamente }
 *       400: { description: Error de validación }
 *       404: { description: Lote no encontrado }
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await configureContainer();
    const body = await req.json();
    const { materials }: { materials: MaterialConsumption[] } = body;

    if (!materials || !Array.isArray(materials) || materials.length === 0) {
      return createErrorResponse('Debe proporcionar una lista de materiales a consumir', 400);
    }

    // Validar que todos los materiales tengan los campos requeridos
    for (const material of materials) {
      if (!material.materialId || !material.quantity || material.quantity <= 0) {
        return createErrorResponse('Cada material debe tener materialId y quantity > 0', 400);
      }
    }

    // Aquí iría la lógica real para consumir materiales
    // Por ahora, devolveremos una respuesta simulada
    const consumptions = materials.map(material => ({
      materialId: material.materialId,
      quantity: material.quantity,
      unitCost: material.unitCost || 0,
      totalCost: material.quantity * (material.unitCost || 0),
      timestamp: new Date().toISOString(),
    }));

    const totalCost = consumptions.reduce((sum, consumption) => sum + consumption.totalCost, 0);

    return createSuccessResponse({
      lotId: params.id,
      consumptions,
      totalCost,
      message: `Consumidos ${materials.length} materiales correctamente`
    });

  } catch (error: unknown) {
    console.error('Error en POST /api/lots/[id]/consume-materials:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}