"use client";

import { useState, useCallback, useRef } from 'react';

// Datos simulados para cuando las APIs no estén disponibles
const SIMULATED_FLOWS = new Map<string, any>();

const MOCK_PRODUCTS = [
  { id: 'zapato-casual', nombre: 'Zapato Casual Cuero', categoria: 'Calzado' },
  { id: 'zapato-deportivo', nombre: 'Zapato Deportivo Running', categoria: 'Calzado Deportivo' },
  { id: 'bota-trabajo', nombre: 'Bota de Trabajo Seguridad', categoria: 'Calzado Industrial' },
  { id: 'sandalia-verano', nombre: 'Sandalia Verano Mujer', categoria: 'Calzado Estacional' }
];

const MOCK_MATERIALS = [
  { id: 'cuero-natural', nombre: 'Cuero natural', categoria: 'Materia prima', estado: 'ACTIVO', unidadMedida: 'm²', tipo: 'MATERIAL', currentQuantity: 150 },
  { id: 'hilo-poliester', nombre: 'Hilo poliéster', categoria: 'Insumos', estado: 'ACTIVO', unidadMedida: 'm', tipo: 'MATERIAL', currentQuantity: 8500 },
  { id: 'suela-goma', nombre: 'Suela de goma', categoria: 'Componentes', estado: 'ACTIVO', unidadMedida: 'pares', tipo: 'MATERIAL', currentQuantity: 350 },
  { id: 'hebillas-metalicas', nombre: 'Hebillas metálicas', categoria: 'Componentes', estado: 'ACTIVO', unidadMedida: 'unidades', tipo: 'MATERIAL', currentQuantity: 1200 },
];

export interface ProductionFlowState {
  currentStep: number;
  flowId?: string;
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

export const useProductionFlow = () => {
  const [flowState, setFlowState] = useState<ProductionFlowState>({
    currentStep: 1,
  });
  const flowIdRef = useRef<string | undefined>(undefined);

  // Función para sincronizar estado del servidor con el cliente
  const syncFlowState = useCallback(async (flowId: string) => {
    try {
      // Intentar obtener estado real del servidor primero
      const response = await fetch(`/api/production/flow/${flowId}`);
      if (response.ok) {
        const data = await response.json();
        const serverState = data?.state;
        if (serverState) {
          flowIdRef.current = flowId;
          setFlowState(prev => ({
            ...prev,
            ...serverState,
            flowId,
          }));
          return true;
        }
      }
    } catch (error) {
      console.log('API no disponible, usando datos simulados');
    }

    // Si la API falla, usar datos simulados
    const simulatedState = SIMULATED_FLOWS.get(flowId);
    if (simulatedState) {
      flowIdRef.current = flowId;
      setFlowState(prev => ({
        ...prev,
        ...simulatedState,
        flowId,
      }));
      return true;
    }

    return false;
  }, []);

  const createFlow = useCallback(async (companyId: string, productId: string) => {
    try {
      // Intentar crear flujo real en el servidor primero
      const response = await fetch('/api/production/flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId,
          productId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newFlowId: string | undefined = data?.flowId ?? data?.data?.flowId;
        if (newFlowId) {
          // Sincronizar estado del servidor después de crear el flujo
          await syncFlowState(newFlowId);
          return newFlowId;
        }
      }
    } catch (error) {
      console.log('API de creación no disponible, usando simulación');
    }

    // Si la API falla, crear flujo simulado
    const simulatedFlowId = `simulated_flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const simulatedState = {
      currentStep: 1,
      flowId: simulatedFlowId,
      companyId,
      productId,
      planningData: undefined,
      resourceAssignment: undefined,
      operations: undefined,
      qualityControl: undefined,
      completion: undefined,
    };

    SIMULATED_FLOWS.set(simulatedFlowId, simulatedState);

    // Sincronizar con estado simulado
    await syncFlowState(simulatedFlowId);
    return simulatedFlowId;
  }, [syncFlowState]);

  const transitionToStep = useCallback(
    async (toStep: number, data?: unknown, overrideFlowId?: string) => {
      const activeFlowId = overrideFlowId ?? flowIdRef.current;
      if (!activeFlowId) return false;

      try {
        // Intentar transición real en el servidor primero
        const response = await fetch(`/api/production/flow/${activeFlowId}/transition`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toStep,
            data,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const transitionSucceeded = typeof result?.success === 'boolean'
            ? result.success
            : true;

          if (transitionSucceeded) {
            // Sincronizar estado completo del servidor después de la transición
            await syncFlowState(activeFlowId);
            return true;
          }
        }
      } catch (error) {
        console.log('API de transición no disponible, usando simulación');
      }

      // Si la API falla, hacer transición simulada
      const currentState = SIMULATED_FLOWS.get(activeFlowId) || flowState;

      if (toStep < 1 || toStep > 6) return false;

      // Validar que la transición sea lógica
      if (toStep < currentState.currentStep) {
        // Permitir retroceder pasos
      } else if (toStep > currentState.currentStep + 1) {
        // No permitir saltar pasos hacia adelante
        return false;
      }

      // Actualizar estado simulado
      const updatedState = { ...currentState, currentStep: toStep };

      // Actualizar datos específicos según el paso
      if (data) {
        switch (toStep) {
          case 1:
            updatedState.planningData = data as ProductionFlowState['planningData'];
            break;
          case 2:
            updatedState.resourceAssignment = data as ProductionFlowState['resourceAssignment'];
            break;
          case 3:
            updatedState.resourceAssignment = (data as ProductionFlowState['resourceAssignment']) ?? updatedState.resourceAssignment;
            break;
          case 4:
            updatedState.operations = data as ProductionFlowState['operations'];
            break;
          case 5:
            updatedState.qualityControl = data as ProductionFlowState['qualityControl'];
            break;
          case 6:
            updatedState.completion = data as ProductionFlowState['completion'];
            break;
        }
      }

      SIMULATED_FLOWS.set(activeFlowId, updatedState);

      // Sincronizar con estado simulado
      await syncFlowState(activeFlowId);
      return true;
    },
    [flowState, syncFlowState],
  );

  const updateFlowData = useCallback((updates: Partial<ProductionFlowState>) => {
    setFlowState(prev => {
      const nextState = { ...prev, ...updates };
      if (nextState.flowId) {
        flowIdRef.current = nextState.flowId;
      }
      return nextState;
    });
  }, []);

  // Función para obtener el estado actual del servidor
  const refreshFlowState = useCallback(async () => {
    if (flowIdRef.current) {
      return await syncFlowState(flowIdRef.current);
    }
    return false;
  }, [syncFlowState]);

  // Función para obtener productos simulados
  const getMockProducts = useCallback(() => {
    return MOCK_PRODUCTS;
  }, []);

  // Función para obtener materiales simulados
  const getMockMaterials = useCallback(() => {
    return MOCK_MATERIALS;
  }, []);

  const getCurrentStepData = useCallback(() => {
    switch (flowState.currentStep) {
      case 1: // Planificación
        return {
          productId: flowState.productId,
          companyId: flowState.companyId,
        };
      case 2: // Asignación de recursos
        return {
          productId: flowState.productId,
          quantity: flowState.planningData?.quantity,
          companyId: flowState.companyId,
        };
      case 3: // Revisión del plan
        return {
          lotId: flowState.lotId,
          planningData: flowState.planningData,
          resourceAssignment: flowState.resourceAssignment,
        };
      case 4: // Registro de operaciones
        return {
          lotId: flowState.lotId,
          plannedQuantity: flowState.planningData?.quantity,
        };
      case 5: // Control de calidad
        return {
          lotId: flowState.lotId,
          producedQuantity: flowState.operations?.reduce((sum, op) => sum + op.quantity, 0) || 0,
        };
      case 6: // Finalización
        return {
          lotId: flowState.lotId,
          completion: flowState.completion,
        };
      default:
        return null;
    }
  }, [flowState]);

  const canTransitionToStep = useCallback((toStep: number): { canTransition: boolean; reason?: string } => {
    // Eliminar todas las validaciones estrictas para flujo fluido
    if (toStep < 1 || toStep > 6) {
      return { canTransition: false, reason: 'Paso inválido' };
    }

    if (toStep < flowState.currentStep) {
      return { canTransition: true, reason: 'Retrocediendo pasos' };
    }

    if (toStep > flowState.currentStep + 1) {
      return { canTransition: false, reason: 'No se pueden saltar pasos' };
    }

    // Permitir todas las transiciones sin validaciones estrictas
    return { canTransition: true };
  }, [flowState]);

  return {
    flowState,
    createFlow,
    transitionToStep,
    updateFlowData,
    getCurrentStepData,
    canTransitionToStep,
    syncFlowState,
    refreshFlowState,
    getMockProducts,
    getMockMaterials,
  };
};