import { injectable } from "tsyringe";

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  results: {
    costs: {
      materials: number;
      labor: number;
      overhead: number;
      total: number;
    };
    timeline: {
      planned: number; // días
      estimated: number; // días
    };
    efficiency: number; // porcentaje
    quality: number; // porcentaje
    recommendations: string[];
  };
}

@injectable()
export class ProductionSimulationService {
  private scenarios: Map<string, SimulationScenario> = new Map();

  constructor() {
    this.initializeDefaultScenarios();
  }

  private initializeDefaultScenarios(): void {
    // Escenario optimista
    this.scenarios.set('optimistic', {
      id: 'optimistic',
      name: 'Escenario Optimista',
      description: 'Condiciones ideales con máxima eficiencia',
      parameters: {
        efficiency: 0.95,
        quality: 0.98,
        materialWaste: 0.02,
        laborProductivity: 1.1,
      }
    });

    // Escenario realista
    this.scenarios.set('realistic', {
      id: 'realistic',
      name: 'Escenario Realista',
      description: 'Condiciones normales de producción',
      parameters: {
        efficiency: 0.85,
        quality: 0.92,
        materialWaste: 0.05,
        laborProductivity: 1.0,
      }
    });

    // Escenario conservador
    this.scenarios.set('conservative', {
      id: 'conservative',
      name: 'Escenario Conservador',
      description: 'Condiciones con posibles contratiempos',
      parameters: {
        efficiency: 0.75,
        quality: 0.88,
        materialWaste: 0.08,
        laborProductivity: 0.9,
      }
    });
  }

  async simulateProduction(
    productId: string,
    quantity: number,
    scenarioId: string = 'realistic'
  ): Promise<SimulationResult> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Escenario ${scenarioId} no encontrado`);
    }

    // Simular costos base (estos vendrían de datos reales)
    const baseMaterialCost = 45.45; // costo promedio por unidad
    const baseLaborCost = 12.50; // costo por hora de mano de obra
    const overheadRate = 0.15; // 15% de costos indirectos

    // Aplicar factores del escenario
    const materialCost = baseMaterialCost * quantity * (1 + scenario.parameters.materialWaste);
    const laborCost = baseLaborCost * this.calculateLaborHours(quantity) * scenario.parameters.laborProductivity;
    const overheadCost = (materialCost + laborCost) * overheadRate;
    const totalCost = materialCost + laborCost + overheadCost;

    // Calcular timeline
    const baseDays = this.calculateProductionDays(quantity);
    const plannedDays = baseDays;
    const estimatedDays = Math.ceil(baseDays / scenario.parameters.efficiency);

    return {
      scenario,
      results: {
        costs: {
          materials: materialCost,
          labor: laborCost,
          overhead: overheadCost,
          total: totalCost,
        },
        timeline: {
          planned: plannedDays,
          estimated: estimatedDays,
        },
        efficiency: scenario.parameters.efficiency * 100,
        quality: scenario.parameters.quality * 100,
        recommendations: this.generateRecommendations(scenario, totalCost, estimatedDays),
      }
    };
  }

  private calculateLaborHours(quantity: number): number {
    // Estimación: 2 horas por unidad para zapatos
    return quantity * 2;
  }

  private calculateProductionDays(quantity: number): number {
    const hours = this.calculateLaborHours(quantity);
    const hoursPerDay = 8;
    return Math.ceil(hours / hoursPerDay);
  }

  private generateRecommendations(scenario: SimulationScenario, totalCost: number, estimatedDays: number): string[] {
    const recommendations: string[] = [];

    if (scenario.parameters.efficiency < 0.8) {
      recommendations.push('Considere optimizar procesos para mejorar eficiencia');
    }

    if (scenario.parameters.materialWaste > 0.05) {
      recommendations.push('Revisar manejo de materiales para reducir desperdicios');
    }

    if (estimatedDays > 10) {
      recommendations.push('Considere dividir en lotes más pequeños para mejor control');
    }

    if (totalCost > 10000) {
      recommendations.push('Evaluar proveedores alternativos para reducir costos');
    }

    return recommendations;
  }

  getAvailableScenarios(): SimulationScenario[] {
    return Array.from(this.scenarios.values());
  }
}