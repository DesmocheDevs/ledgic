import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export interface RegistrarCompraRequest {
  material_id: string;
  cantidad_comprada: number;
  precio_unitario_compra: number;
}

export interface RegistrarCompraResponse {
  material: Material;
  valor_compra: number;
  nueva_cantidad_total: number;
  nuevo_valor_total_inventario: number;
  nuevo_cpp: number;
}

@injectable()
export class RegistrarCompraMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute({ 
    material_id, 
    cantidad_comprada, 
    precio_unitario_compra 
  }: RegistrarCompraRequest): Promise<RegistrarCompraResponse> {
    // Validar parámetros de entrada
    this.validateInput(cantidad_comprada, precio_unitario_compra);

    // Obtener el estado actual del material
    const material = await this.repository.findById(UUID.fromString(material_id));
    if (!material) {
      throw new DomainError('Material no encontrado');
    }

    // Obtener valores actuales (usar 0 si son null para la primera compra)
    const cantidadActual = material.cantidadActual || 0;
    const valorTotalInventarioActual = material.valorTotalInventario || 0;

    // Calcular valor de la compra
    const valor_compra = cantidad_comprada * precio_unitario_compra;

    // Calcular nuevos valores
    const nueva_cantidad_total = cantidadActual + cantidad_comprada;
    const nuevo_valor_total_inventario = valorTotalInventarioActual + valor_compra;
    const nuevo_cpp = nuevo_valor_total_inventario / nueva_cantidad_total;

    // Actualizar el material con los nuevos valores
    material.update({
      cantidadActual: nueva_cantidad_total,
      valorTotalInventario: nuevo_valor_total_inventario,
      costoPromedioPonderado: nuevo_cpp,
      precioCompra: precio_unitario_compra // Actualizar también el último precio de compra
    });

    // Guardar los cambios en la base de datos
    await this.repository.update(material);

    return {
      material,
      valor_compra,
      nueva_cantidad_total,
      nuevo_valor_total_inventario,
      nuevo_cpp
    };
  }

  private validateInput(cantidad_comprada: number, precio_unitario_compra: number): void {
    if (cantidad_comprada <= 0) {
      throw new DomainError('La cantidad comprada debe ser mayor a 0');
    }
    if (precio_unitario_compra <= 0) {
      throw new DomainError('El precio unitario de compra debe ser mayor a 0');
    }
    if (isNaN(cantidad_comprada) || isNaN(precio_unitario_compra)) {
      throw new DomainError('La cantidad y precio deben ser números válidos');
    }
  }
}