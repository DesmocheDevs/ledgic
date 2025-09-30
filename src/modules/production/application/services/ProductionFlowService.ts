import { injectable } from "tsyringe";

export interface ProductionFlowState {
  currentStep: number;
  lotId?: string;
  productId?: string;
  companyId?: string;
  planningData?: {
    quantity: number;
    priority: string;
    startDate?: string;
    endDate?: string;
  };
  resourceAssignment?: {
    materials: Array<{
      materialId: string;
      quantity: number;
      available: number;
    }>;
    lotCode?: string;
  };
  operations?: Array<{
    operationName: string;
    quantity: number;
    hoursWorked: number;
    workersCount: number;
    completed: boolean;
  }>;
  qualityControl?: {
    sampleSize: number;
    approvedQuantity: number;
    rejectedQuantity: number;
    checks: Array<{
      checkName: string;
      passed: boolean;
      critical: boolean;
    }>;
  };
  completion?: {
    totalCost: number;
    unitCost: number;
    actualDuration: number;
    qualityRate: number;
  };
}

export interface FlowTransition {
  fromStep: number;
  toStep: number;
  action: string;
  data?: any;
}

@injectable()
export class ProductionFlowService {
  private flowStates: Map<string, ProductionFlowState> = new Map();

  // Crear un nuevo flujo de producción
  createFlow(companyId: string, productId: string): string {
    const flowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const initialState: ProductionFlowState = {
      currentStep: 1,
      companyId,
      productId,
    };

    this.flowStates.set(flowId, initialState);
    return flowId;
  }

  // Obtener estado actual del flujo
  getFlowState(flowId: string): ProductionFlowState | null {
    return this.flowStates.get(flowId) || null;
  }

  // Actualizar estado del flujo
  updateFlowState(flowId: string, updates: Partial<ProductionFlowState>): boolean {
    const currentState = this.flowStates.get(flowId);
    if (!currentState) return false;

    const updatedState = { ...currentState, ...updates };
    this.flowStates.set(flowId, updatedState);
    return true;
  }

  // Transición entre pasos
  transitionToStep(flowId: string, toStep: number, data?: any): boolean {
    const currentState = this.flowStates.get(flowId);
    if (!currentState) return false;

    if (toStep < 1 || toStep > 6) return false;

    // Validar que la transición sea lógica
    if (toStep < currentState.currentStep) {
      // Permitir retroceder pasos
    } else if (toStep > currentState.currentStep + 1) {
      // No permitir saltar pasos hacia adelante
      return false;
    }

    currentState.currentStep = toStep;

    // Actualizar datos específicos según el paso
    switch (toStep) {
      case 1: // Planificación
        if (data) {
          currentState.planningData = data;
        }
        break;
      case 2: // Asignación de recursos
        if (data) {
          currentState.resourceAssignment = data;
        }
        break;
      case 3: // Revisión del plan
        // Consolidar datos de planificación y recursos
        break;
      case 4: // Registro de operaciones
        if (data) {
          currentState.operations = data;
        }
        break;
      case 5: // Control de calidad
        if (data) {
          currentState.qualityControl = data;
        }
        break;
      case 6: // Finalización
        if (data) {
          currentState.completion = data;
        }
        break;
    }

    this.flowStates.set(flowId, currentState);
    return true;
  }

  // Validar si puede pasar al siguiente paso
  canTransitionToStep(flowId: string, toStep: number): { canTransition: boolean; reason?: string } {
    const currentState = this.flowStates.get(flowId);
    if (!currentState) {
      return { canTransition: false, reason: 'Flujo no encontrado' };
    }

    if (toStep < 1 || toStep > 6) {
      return { canTransition: false, reason: 'Paso inválido' };
    }

    if (toStep < currentState.currentStep) {
      return { canTransition: true, reason: 'Retrocediendo pasos' };
    }

    if (toStep > currentState.currentStep + 1) {
      return { canTransition: false, reason: 'No se pueden saltar pasos' };
    }

    // Validaciones específicas por paso
    switch (toStep) {
      case 2: // De planificación a asignación de recursos
        if (!currentState.planningData?.quantity) {
          return { canTransition: false, reason: 'Debe completar la planificación primero' };
        }
        break;
      case 3: // De asignación a revisión
        if (!currentState.resourceAssignment?.lotCode) {
          return { canTransition: false, reason: 'Debe completar la asignación de recursos primero' };
        }
        break;
      case 4: // De revisión a operaciones
        if (!currentState.lotId) {
          return { canTransition: false, reason: 'Debe crear el lote primero' };
        }
        break;
      case 5: // De operaciones a calidad
        if (!currentState.operations || currentState.operations.length === 0) {
          return { canTransition: false, reason: 'Debe registrar al menos una operación primero' };
        }
        break;
      case 6: // De calidad a finalización
        if (!currentState.qualityControl) {
          return { canTransition: false, reason: 'Debe completar el control de calidad primero' };
        }
        break;
    }

    return { canTransition: true };
  }

  // Obtener datos requeridos para un paso específico
  getRequiredDataForStep(flowId: string, step: number): any {
    const currentState = this.flowStates.get(flowId);
    if (!currentState) return null;

    switch (step) {
      case 1: // Planificación
        return {
          productId: currentState.productId,
          companyId: currentState.companyId,
        };
      case 2: // Asignación de recursos
        return {
          productId: currentState.productId,
          quantity: currentState.planningData?.quantity,
          companyId: currentState.companyId,
        };
      case 3: // Revisión del plan
        return {
          lotId: currentState.lotId,
          planningData: currentState.planningData,
          resourceAssignment: currentState.resourceAssignment,
        };
      case 4: // Registro de operaciones
        return {
          lotId: currentState.lotId,
          plannedQuantity: currentState.planningData?.quantity,
        };
      case 5: // Control de calidad
        return {
          lotId: currentState.lotId,
          producedQuantity: currentState.operations?.reduce((sum, op) => sum + op.quantity, 0) || 0,
        };
      case 6: // Finalización
        return {
          lotId: currentState.lotId,
          completion: currentState.completion,
        };
      default:
        return null;
    }
  }

  // Completar flujo
  completeFlow(flowId: string): ProductionFlowState | null {
    const currentState = this.flowStates.get(flowId);
    if (!currentState) return null;

    currentState.currentStep = 6;
    this.flowStates.set(flowId, currentState);

    // Aquí se podría limpiar el estado después de un tiempo
    // setTimeout(() => this.flowStates.delete(flowId), 3600000); // 1 hora

    return currentState;
  }

  // Limpiar flujo (útil para cancelaciones)
  clearFlow(flowId: string): boolean {
    return this.flowStates.delete(flowId);
  }

  // Obtener estadísticas del flujo
  getFlowStats(): { totalFlows: number; activeFlows: number; completedFlows: number } {
    const flows = Array.from(this.flowStates.values());
    return {
      totalFlows: flows.length,
      activeFlows: flows.filter(f => f.currentStep < 6).length,
      completedFlows: flows.filter(f => f.currentStep === 6).length,
    };
  }
}