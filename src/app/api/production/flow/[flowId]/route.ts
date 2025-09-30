import "reflect-metadata";
import { container, configureContainer } from "../../../../../shared/container";
import { ProductionFlowService } from "../../../../../modules/production/application/services/ProductionFlowService";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { flowId: string } }) {
  try {
    await configureContainer();

    const flowService = container.resolve(ProductionFlowService);
    const flowState = flowService.getFlowState(params.flowId);

    if (!flowState) {
      return createErrorResponse('Flujo no encontrado', 404);
    }

    return createSuccessResponse({
      flowId: params.flowId,
      state: flowState,
    });
  } catch (error: unknown) {
    console.error('Error en GET /api/production/flow/[flowId]:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse('Error interno del servidor', 500);
  }
}
