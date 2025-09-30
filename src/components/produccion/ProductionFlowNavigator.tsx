"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Clock } from 'lucide-react';
import { useProductionFlow } from '@/hooks/useProductionFlow';

interface ProductionFlowNavigatorProps {
  currentStep: number;
  totalSteps: number;
  canProceed?: boolean;
  onNext?: () => Promise<boolean>;
  onPrevious?: () => void;
  nextDisabled?: boolean;
  loading?: boolean;
}

export const ProductionFlowNavigator: React.FC<ProductionFlowNavigatorProps> = ({
  currentStep,
  totalSteps,
  canProceed = true,
  onNext,
  onPrevious,
  nextDisabled = false,
  loading = false,
}) => {
  const router = useRouter();
  const { flowState, canTransitionToStep, transitionToStep, refreshFlowState } = useProductionFlow();

  const getStepTitle = (stepNumber: number) => {
    const steps = [
      'Planificar',
      'Asignar Recursos',
      'Revisar Plan',
      'Registrar Operaciones',
      'Control de Calidad',
      'Finalizar'
    ];
    return steps[stepNumber - 1] || '';
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  const handleNext = async () => {
    // Si hay un callback personalizado (como en las páginas), usarlo
    if (onNext) {
      const success = await onNext();
      if (success) {
        const nextStep = currentStep + 1;
        if (nextStep <= totalSteps) {
          router.push(getStepRoute(nextStep));
        }
      }
      return;
    }

    // Si no hay callback personalizado, navegación directa sin validaciones
    try {
      const nextStep = currentStep + 1;
      if (nextStep <= totalSteps) {
        router.push(getStepRoute(nextStep));
      }
    } catch (error) {
      console.error('Error en navegación:', error);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      const prevStep = currentStep - 1;
      if (prevStep >= 1) {
        router.push(getStepRoute(prevStep));
      }
    }
  };

  const getStepRoute = (step: number) => {
    const routes = [
      '/dashboard/produccion/planificar',
      '/dashboard/produccion/asignar-recursos',
      '/dashboard/produccion/revisar-plan',
      '/dashboard/produccion/registrar-operaciones',
      '/dashboard/produccion/control-calidad',
      '/dashboard/produccion/finalizar'
    ];
    return routes[step - 1] || routes[0];
  };

  const getStepIcon = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Progreso visual */}
          <div className="flex items-center space-x-4">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNum = i + 1;
              const status = getStepStatus(stepNum);

              return (
                <div key={stepNum} className="flex items-center space-x-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    status === 'completed' ? 'bg-green-100' :
                    status === 'current' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getStepIcon(stepNum)}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-medium ${
                      status === 'current' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {getStepTitle(stepNum)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Paso {stepNum} de {totalSteps}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={nextDisabled || loading || !canProceed}
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard/produccion')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Producción
              </Button>
            )}
          </div>
        </div>

        {/* Información del estado del flujo */}
        {flowState.flowId && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Flujo ID: {flowState.flowId}</span>
              <Badge variant="outline">
                Estado: {getStepStatus(currentStep) === 'current' ? 'En Progreso' : 'Pendiente'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};