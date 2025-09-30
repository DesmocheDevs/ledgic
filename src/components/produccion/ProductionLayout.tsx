"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { Button as ProductionButton } from '@/components/ui/button';

interface ProductionLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ProductionLayout: React.FC<ProductionLayoutProps> = ({
  children,
  title,
  subtitle,
  step,
  totalSteps,
  onBack,
  showBackButton = true
}) => {
  const pathname = usePathname();

  const getStepTitle = (stepNumber: number) => {
    const steps = [
      'Planificar',
      'Asignar',
      'Revisar',
      'Producir',
      'Calidad',
      'Finalizar'
    ];
    return steps[stepNumber - 1] || '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header con progreso */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Breadcrumb de pasos */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => {
                const stepNum = i + 1;
                const isCompleted = stepNum < step;
                const isCurrent = stepNum === step;

                return (
                  <React.Fragment key={stepNum}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-smooth ${
                      isCompleted 
                        ? 'bg-primary text-primary-foreground' 
                        : isCurrent 
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        stepNum
                      )}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {getStepTitle(stepNum)}
                    </span>
                    {stepNum < totalSteps && (
                      <div className={`w-8 h-0.5 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Título y navegación */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && onBack && (
                <ProductionButton
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-5 h-5" />
                </ProductionButton>
              )}
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Paso {step} de {totalSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default ProductionLayout;
