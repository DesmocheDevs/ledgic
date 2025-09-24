import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export interface RegistrarConsumoRequest {
  material_id: string;
  cantidad_consumida: number;
  lote_id: string;
}

export interface RegistrarConsumoResponse {
  material: Material;
  costo_total_consumo: number;
  nueva_cantidad_total: number;
  nuevo_valor_total_inventario: number;
  costo_promedio_ponderado: number;
}

@injectable()
export class RegistrarConsumoMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute({ 
    material_id, 
    cantidad_consumida, 
    lote_id 
  }: RegistrarConsumoRequest): Promise<RegistrarConsumoResponse> {
    // Validar parámetros de entrada
    this.validateInput(cantidad_consumida, lote_id);

    // Obtener el estado actual del material
    const material = await this.repository.findById(UUID.fromString(material_id));
    if (!material) {
      throw new DomainError('Material no encontrado');
    }

    // Verificar que el material tenga datos de inventario
    if (material.cantidadActual === null || material.valorTotalInventario === null || material.costoPromedioPonderado === null) {
      throw new DomainError('El material no tiene información de inventario válida');
    }

    // Verificar si cantidad_consumida <= CantidadActual
    if (cantidad_consumida > material.cantidadActual) {
      throw new DomainError('La cantidad a consumir excede la cantidad disponible en inventario');
    }

    // Calcular costo_total_consumo = cantidad_consumida * CostoPromedioPonderado
    const costo_total_consumo = cantidad_consumida * material.costoPromedioPonderado;

    // Calcular nuevos valores
    const nueva_cantidad_total = material.cantidadActual - cantidad_consumida;
    const nuevo_valor_total_inventario = material.valorTotalInventario - costo_total_consumo;

    // Actualizar el material con los nuevos valores (el CPP no cambia)
    material.update({
      cantidadActual: nueva_cantidad_total,
      valorTotalInventario: nuevo_valor_total_inventario
    });

    // Guardar los cambios en la base de datos
    await this.repository.update(material);

    // Insertar registro en la tabla RegistroProduccion
    await this.repository.insertRegistroProduccion({
      lote_id,
      material_id,
      cantidad: cantidad_consumida,
      costoUnitario: material.costoPromedioPonderado,
      costoTotal: costo_total_consumo,
      fecha: new Date()
    });

    return {
      material,
      costo_total_consumo,
      nueva_cantidad_total,
      nuevo_valor_total_inventario,
      costo_promedio_ponderado: material.costoPromedioPonderado
    };
  }

  private validateInput(cantidad_consumida: number, lote_id: string): void {
    if (cantidad_consumida <= 0) {
      throw new DomainError('La cantidad consumida debe ser mayor a 0');
    }
    if (isNaN(cantidad_consumida)) {
      throw new DomainError('La cantidad debe ser un número válido');
    }
    if (!lote_id || lote_id.trim().length === 0) {
      throw new DomainError('El ID del lote es requerido');
    }
  }
}