import { injectable } from "tsyringe";

export interface PlanningSimulationParams {
  productId: string;
  quantity: number;
  startDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  scenario?: 'optimistic' | 'realistic' | 'conservative';
}

export interface PlanningSimulationResult {
  feasibility: {
    isFeasible: boolean;
    constraints: string[];
    warnings: string[];
  };
  timeline: {
    estimatedStart: Date;
    estimatedEnd: Date;
    duration: number; // días
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

@injectable()
export class PlanningSimulationService {
  async simulatePlanning(params: PlanningSimulationParams): Promise<PlanningSimulationResult> {
    const { productId, quantity, startDate, priority = 'medium', scenario = 'realistic' } = params;

    // Simular análisis de factibilidad
    const feasibility = this.analyzeFeasibility(productId, quantity, scenario);

    // Calcular timeline
    const timeline = this.calculateTimeline(quantity, startDate, scenario);

    // Analizar recursos necesarios
    const resources = this.analyzeResources(productId, quantity, scenario);

    // Calcular costos
    const costs = this.calculateCosts(resources, scenario);

    // Identificar riesgos
    const risks = this.identifyRisks(feasibility, resources, timeline, scenario);

    return {
      feasibility,
      timeline,
      resources,
      costs,
      risks,
    };
  }

  private analyzeFeasibility(productId: string, quantity: number, scenario: string) {
    const constraints: string[] = [];
    const warnings: string[] = [];

    // Simular verificaciones de capacidad
    if (quantity > 1000) {
      constraints.push('Cantidad excede capacidad máxima recomendada por lote');
    }

    if (scenario === 'conservative' && quantity > 500) {
      warnings.push('Escenario conservador sugiere lotes más pequeños');
    }

    // Simular disponibilidad de recursos críticos
    const criticalMaterials = this.getCriticalMaterials(productId);
    for (const material of criticalMaterials) {
      if (material.shortage > 0) {
        constraints.push(`Material crítico insuficiente: ${material.name}`);
      }
    }

    return {
      isFeasible: constraints.length === 0,
      constraints,
      warnings,
    };
  }

  private calculateTimeline(quantity: number, startDate?: Date, scenario?: string) {
    const baseDays = Math.ceil(quantity / 50); // 50 unidades por día como base
    const scenarioMultiplier = scenario === 'optimistic' ? 0.8 : scenario === 'conservative' ? 1.3 : 1.0;

    const duration = Math.ceil(baseDays * scenarioMultiplier);
    const estimatedStart = startDate || new Date();
    const estimatedEnd = new Date(estimatedStart);
    estimatedEnd.setDate(estimatedEnd.getDate() + duration);

    return {
      estimatedStart,
      estimatedEnd,
      duration,
      criticalPath: ['Corte', 'Costura', 'Montado', 'Acabados', 'Control de Calidad'],
    };
  }

  private analyzeResources(productId: string, quantity: number, scenario: string) {
    // Simular materiales requeridos (datos vendrían de BOM real)
    const materials = [
      {
        materialId: 'cuero-001',
        name: 'Cuero Natural Premium',
        required: quantity * 2.5,
        available: 100.5,
        shortage: Math.max(0, (quantity * 2.5) - 100.5),
        cost: 45.45,
      },
      {
        materialId: 'hilo-001',
        name: 'Hilo Poliéster 40/2',
        required: quantity * 150,
        available: 5000,
        shortage: 0,
        cost: 0.12,
      },
      {
        materialId: 'suela-001',
        name: 'Suela de Goma',
        required: quantity * 2,
        available: 200,
        shortage: Math.max(0, (quantity * 2) - 200),
        cost: 12.75,
      },
    ];

    // Calcular mano de obra
    const totalHours = quantity * 2; // 2 horas por unidad
    const baseDays = Math.ceil(quantity / 50); // 50 unidades por día como base
    const workersNeeded = Math.ceil(totalHours / (8 * baseDays));
    const laborCost = totalHours * 12.50; // $12.50 por hora

    return {
      materials,
      labor: {
        totalHours,
        workersNeeded,
        cost: laborCost,
      },
    };
  }

  private calculateCosts(resources: any, scenario: string) {
    const materialsCost = resources.materials.reduce((sum: number, material: any) =>
      sum + (material.required * material.cost), 0
    );

    const laborCost = resources.labor.cost;
    const overheadRate = scenario === 'optimistic' ? 0.12 : scenario === 'conservative' ? 0.18 : 0.15;
    const overheadCost = (materialsCost + laborCost) * overheadRate;
    const totalCost = materialsCost + laborCost + overheadCost;
    const unitCost = totalCost / resources.materials[0]?.required / 2.5 || 0; // por unidad

    return {
      materials: materialsCost,
      labor: laborCost,
      overhead: overheadCost,
      total: totalCost,
      unitCost,
    };
  }

  private identifyRisks(feasibility: any, resources: any, timeline: any, scenario: string) {
    const risks: any[] = [];

    // Riesgos de materiales
    const materialShortages = resources.materials.filter((m: any) => m.shortage > 0);
    if (materialShortages.length > 0) {
      risks.push({
        type: 'material' as const,
        description: `Escasez de ${materialShortages.length} material(es) crítico(s)`,
        probability: 0.8,
        impact: 'high' as const,
      });
    }

    // Riesgos de tiempo
    if (timeline.duration > 10) {
      risks.push({
        type: 'time' as const,
        description: 'Proyecto de larga duración aumenta riesgo de contratiempos',
        probability: 0.6,
        impact: 'medium' as const,
      });
    }

    // Riesgos de calidad
    if (scenario === 'conservative') {
      risks.push({
        type: 'quality' as const,
        description: 'Escenario conservador indica posibles problemas de calidad',
        probability: 0.4,
        impact: 'medium' as const,
      });
    }

    return risks;
  }

  private getCriticalMaterials(productId: string) {
    // Simular materiales críticos (vendría de configuración real)
    return [
      { name: 'Cuero Natural Premium', shortage: 0 },
      { name: 'Suela de Goma', shortage: 0 },
    ];
  }
}