import "reflect-metadata";
import { container, configureContainer } from "../../../../../../shared/container";
import { ProductionFlowService } from "../../../../../../modules/production/application/services/ProductionFlowService";
import { DomainError } from "../../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { flowId: string } }) {
  try {
    await configureContainer();
    const body = await req.json();
    const { toStep, data } = body;

    if (!toStep || toStep < 1 || toStep > 6) {
      return createErrorResponse('toStep debe ser un número entre 1 y 6', 400);
    }

    const flowService = container.resolve(ProductionFlowService);

    const validation = flowService.canTransitionToStep(params.flowId, toStep);
    if (!validation.canTransition) {
      return createErrorResponse(validation.reason || 'No se puede realizar la transición', 400);
    }

    const success = flowService.transitionToStep(params.flowId, toStep, data);

    if (!success) {
      return createErrorResponse('Error al realizar la transición', 500);
    }

    const updatedState = flowService.getFlowState(params.flowId);

    return createSuccessResponse({
      flowId: params.flowId,
      currentStep: toStep,
      state: updatedState,
      message: `Transición al paso ${toStep} completada`,
    });
  } catch (error: unknown) {
    console.error('Error en POST /api/production/flow/[flowId]/transition:', error);
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse('Error interno del servidor', 500);
  }
}
