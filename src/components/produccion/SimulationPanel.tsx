"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Users,
  Target
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

interface PlanningSimulationResult {
  feasibility: {
    isFeasible: boolean;
    constraints: string[];
    warnings: string[];
  };
  timeline: {
    estimatedStart: string;
    estimatedEnd: string;
    duration: number;
    criticalPath: string[];
  };
  resources: {
    materials: Array<{
      materialId: string;
      name: string;
      required: number;
      available: number;
      shortage: number;
      cost: number;
    }>;
    labor: {
      totalHours: number;
      workersNeeded: number;
      cost: number;
    };
  };
  costs: {
    materials: number;
    labor: number;
    overhead: number;
    total: number;
    unitCost: number;
  };
  risks: Array<{
    type: 'material' | 'labor' | 'time' | 'quality';
    description: string;
    probability: number;
    impact: 'low' | 'medium' | 'high';
  }>;
}

interface SimulationPanelProps {
  productId?: string;
  quantity?: number;
  onSimulationComplete?: (result: PlanningSimulationResult) => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  productId,
  quantity,
  onSimulationComplete,
}) => {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('realistic');

  // Estado inicial para evitar errores de Select vacío
  useEffect(() => {
    if (scenarios.length === 0) {
      // Escenarios por defecto mientras se cargan los reales
      setScenarios([
        { id: 'optimistic', name: 'Optimista', description: 'Condiciones ideales', parameters: {} },
        { id: 'realistic', name: 'Realista', description: 'Condiciones normales', parameters: {} },
        { id: 'conservative', name: 'Conservador', description: 'Condiciones conservadoras', parameters: {} },
      ]);
    }
  }, [scenarios.length]);
  const [simulationQuantity, setSimulationQuantity] = useState<number>(quantity || 100);
  const [simulationResult, setSimulationResult] = useState<PlanningSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener escenarios disponibles
  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      console.log('🔄 Cargando escenarios de simulación...');
      const response = await fetch('/api/production/simulation/scenarios');
      console.log('📡 Respuesta de escenarios:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Datos de escenarios recibidos:', data);

      if (data.success && Array.isArray(data.data.scenarios)) {
        setScenarios(data.data.scenarios);
        console.log(`🎯 ${data.data.scenarios.length} escenarios cargados`);
      } else {
        console.error('❌ Estructura de respuesta inválida:', data);
      }
    } catch (error) {
      console.error('❌ Error cargando escenarios:', error);
    }
  };

  const runSimulation = async () => {
    if (!productId || !simulationQuantity) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/production/planning-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: simulationQuantity,
          scenario: selectedScenario,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSimulationResult(data.data.simulation);
        onSimulationComplete?.(data.data.simulation);
      }
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'material': return <Package className="w-3 h-3" />;
      case 'labor': return <Users className="w-3 h-3" />;
      case 'time': return <Clock className="w-3 h-3" />;
      case 'quality': return <Target className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5" />
          <span>Simulación de Producción</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controles de simulación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity">Cantidad a simular</Label>
              <Input
                id="quantity"
                type="number"
                value={simulationQuantity}
                onChange={(e) => setSimulationQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="scenario">Escenario</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.length > 0 ? (
                    scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id || 'default'}>
                        {scenario.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-scenarios" disabled>
                      Cargando escenarios...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={runSimulation}
                disabled={isLoading || !productId}
                className="w-full"
              >
                {isLoading ? 'Simulando...' : 'Ejecutar Simulación'}
              </Button>
            </div>
          </div>

          {/* Resultados de simulación */}
          {simulationResult && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="timeline">Tiempo</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
                <TabsTrigger value="risks">Riesgos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Factibilidad</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-2">
                        {simulationResult.feasibility.isFeasible ? (
                          <Badge className="bg-green-500 text-white">Factible</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">No Factible</Badge>
                        )}
                      </div>
                      {simulationResult.feasibility.constraints.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-red-600">Restricciones:</p>
                          {simulationResult.feasibility.constraints.map((constraint, index) => (
                            <p key={index} className="text-xs text-red-600">• {constraint}</p>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Costos</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Materiales:</span>
                          <span>${simulationResult.costs.materials.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mano de obra:</span>
                          <span>${simulationResult.costs.labor.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Indirectos:</span>
                          <span>${simulationResult.costs.overhead.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>${simulationResult.costs.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Costo unitario:</span>
                          <span>${simulationResult.costs.unitCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Cronograma Estimado</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Inicio estimado</p>
                        <p className="font-medium">
                          {new Date(simulationResult.timeline.estimatedStart).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fin estimado</p>
                        <p className="font-medium">
                          {new Date(simulationResult.timeline.estimatedEnd).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duración</p>
                        <p className="font-medium">{simulationResult.timeline.duration} días</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Ruta crítica:</p>
                      <div className="flex flex-wrap gap-2">
                        {simulationResult.timeline.criticalPath.map((activity, index) => (
                          <Badge key={index} variant="outline">{activity}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Materiales Requeridos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {simulationResult.resources.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{material.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Necesario: {material.required} • Disponible: {material.available}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(material.required * material.cost).toFixed(2)}</p>
                            {material.shortage > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                Faltan {material.shortage}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Mano de obra requerida:</span>
                        <span>{simulationResult.resources.labor.workersNeeded} trabajadores</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Horas totales:</span>
                        <span>{simulationResult.resources.labor.totalHours}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Análisis de Riesgos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {simulationResult.risks.length > 0 ? (
                      <div className="space-y-3">
                        {simulationResult.risks.map((risk, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getRiskIcon(risk.type)}
                              <div>
                                <p className="font-medium text-sm">{risk.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Probabilidad: {(risk.probability * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>
                            <Badge className={getRiskBadgeColor(risk.impact)}>
                              {risk.impact.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No se identificaron riesgos significativos</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};