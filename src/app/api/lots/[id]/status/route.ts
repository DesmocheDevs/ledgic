import "reflect-metadata";
import { container, configureContainer } from "../../../../../shared/container";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";
import { ProductionLotStatus } from "../../../../../modules/production/domain/entities/ProductionLot";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/lots/{id}/status:
 *   patch:
 *     tags: [Production]
 *     summary: Actualizar estado de un lote de producción
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
 *               status: { type: string, enum: [PLANNED, IN_PROGRESS, COMPLETED] }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *             required: [status]
 *     responses:
 *       200: { description: Estado actualizado }
 *       400: { description: Error de validación }
 *       404: { description: Lote no encontrado }
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await configureContainer();
    const body = await req.json();
    const { status, startDate, endDate } = body;

    if (!status || !['PLANNED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return createErrorResponse('Estado inválido. Debe ser PLANNED, IN_PROGRESS o COMPLETED', 400);
    }

    // Aquí iría la lógica real para actualizar el estado del lote
    // Por ahora, devolveremos una respuesta simulada
    const updatedLot = {
      id: params.id,
      status,
      startDate: status === 'IN_PROGRESS' ? (startDate || new Date().toISOString()) : null,
      endDate: status === 'COMPLETED' ? (endDate || new Date().toISOString()) : null,
      updatedAt: new Date().toISOString(),
    };

    return createSuccessResponse({
      lot: updatedLot,
      message: `Lote ${status === 'IN_PROGRESS' ? 'iniciado' : status === 'COMPLETED' ? 'finalizado' : 'actualizado'} correctamente`
    });

  } catch (error: unknown) {
    console.error('Error en PATCH /api/lots/[id]/status:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}