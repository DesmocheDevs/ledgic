import "reflect-metadata";
import { container, configureContainer } from "../../../../../shared/container";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface QualityCheck {
  checkName: string;
  passed: boolean;
  notes?: string;
  critical?: boolean;
}

interface QualityInspection {
  lotId: string;
  inspectorId: string;
  sampleSize: number;
  approvedQuantity: number;
  rejectedQuantity: number;
  checks: QualityCheck[];
  overallResult: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  inspectionNotes?: string;
}

/**
 * @swagger
 * /api/lots/{id}/quality-control:
 *   post:
 *     tags: [Production]
 *     summary: Registrar control de calidad de un lote
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
 *               inspectorId: { type: string }
 *               sampleSize: { type: number }
 *               approvedQuantity: { type: number }
 *               rejectedQuantity: { type: number }
 *               checks: { type: array, items: { type: object } }
 *               overallResult: { type: string, enum: [APPROVED, REJECTED, CONDITIONAL] }
 *               inspectionNotes: { type: string }
 *             required: [inspectorId, sampleSize, approvedQuantity, rejectedQuantity, checks, overallResult]
 *     responses:
 *       200: { description: Control de calidad registrado }
 *       400: { description: Error de validación }
 *       404: { description: Lote no encontrado }
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await configureContainer();
    const body = await req.json();
    const {
      inspectorId,
      sampleSize,
      approvedQuantity,
      rejectedQuantity,
      checks,
      overallResult,
      inspectionNotes
    }: QualityInspection = body;

    if (!inspectorId || !sampleSize || !approvedQuantity || !rejectedQuantity || !checks || !overallResult) {
      return createErrorResponse('Todos los campos son requeridos', 400);
    }

    if (sampleSize <= 0 || approvedQuantity < 0 || rejectedQuantity < 0) {
      return createErrorResponse('sampleSize debe ser > 0, cantidades deben ser >= 0', 400);
    }

    if (!['APPROVED', 'REJECTED', 'CONDITIONAL'].includes(overallResult)) {
      return createErrorResponse('overallResult debe ser APPROVED, REJECTED o CONDITIONAL', 400);
    }

    if (!Array.isArray(checks) || checks.length === 0) {
      return createErrorResponse('Debe proporcionar al menos una verificación de calidad', 400);
    }

    // Validar que las cantidades coincidan
    const totalInspected = approvedQuantity + rejectedQuantity;
    if (totalInspected !== sampleSize) {
      return createErrorResponse(`La suma de aprobados + rechazados (${totalInspected}) debe igualar el tamaño de muestra (${sampleSize})`, 400);
    }

    // Aquí iría la lógica real para registrar el control de calidad
    // Por ahora, devolveremos una respuesta simulada
    const inspection = {
      id: `qc_${Date.now()}`,
      lotId: params.id,
      inspectorId,
      sampleSize,
      approvedQuantity,
      rejectedQuantity,
      qualityRate: (approvedQuantity / sampleSize) * 100,
      checks,
      overallResult,
      inspectionNotes,
      timestamp: new Date().toISOString(),
    };

    return createSuccessResponse({
      inspection,
      message: `Control de calidad registrado. Tasa de aprobación: ${inspection.qualityRate.toFixed(1)}%`
    });

  } catch (error: unknown) {
    console.error('Error en POST /api/lots/[id]/quality-control:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}

/**
 * @swagger
 * /api/lots/{id}/quality-control:
 *   get:
 *     tags: [Production]
 *     summary: Obtener controles de calidad de un lote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Lista de controles de calidad }
 *       404: { description: Lote no encontrado }
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await configureContainer();

    // Aquí iría la lógica real para obtener controles de calidad del lote
    // Por ahora, devolveremos una respuesta simulada
    const inspections = [
      {
        id: 'qc_1',
        lotId: params.id,
        inspectorId: 'inspector_1',
        sampleSize: 10,
        approvedQuantity: 9,
        rejectedQuantity: 1,
        qualityRate: 90,
        checks: [
          { checkName: 'Dimensiones', passed: true, critical: true },
          { checkName: 'Acabados', passed: true, critical: false },
          { checkName: 'Funcionalidad', passed: false, critical: true, notes: 'Suela despegada en una muestra' },
        ],
        overallResult: 'CONDITIONAL',
        inspectionNotes: 'Una muestra rechazada por problema en suela',
        timestamp: new Date().toISOString(),
      }
    ];

    return createSuccessResponse({
      lotId: params.id,
      inspections,
      totalInspections: inspections.length,
    });

  } catch (error: unknown) {
    console.error('Error en GET /api/lots/[id]/quality-control:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse("Error interno del servidor", 500);
  }
}