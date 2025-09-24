import { injectable, inject } from 'tsyringe';
import type { MaterialRepository } from '../../domain';
import { Material } from '../../domain';
import { UUID } from '../../../../shared/domain/value-objects/UUID';
import { TOKENS } from '../../../../shared/container';
import { DomainError } from '../../../../shared/domain/errors/DomainError';

export interface InicializarInventarioRequest {
  material_id: string;
  cantidad_inicial: number;
  costo_unitario_inicial: number;
  fecha_ingreso?: string; // opcional, usa fecha actual si no se proporciona
}

export interface InicializarInventarioResponse {
  material: Material;
  cantidad_inicial: number;
  valor_total_inventario: number;
  costo_promedio_ponderado: number;
  fecha_ingreso: Date;
}

@injectable()
export class InicializarInventarioMaterialUseCase {
  constructor(@inject(TOKENS.MaterialRepository) private readonly repository: MaterialRepository) {}

  async execute({ 
    material_id, 
    cantidad_inicial, 
    costo_unitario_inicial,
    fecha_ingreso 
  }: InicializarInventarioRequest): Promise<InicializarInventarioResponse> {
    // Validar parámetros de entrada
    this.validateInput(cantidad_inicial, costo_unitario_inicial, fecha_ingreso);

    // Obtener el material
    const material = await this.repository.findById(UUID.fromString(material_id));
    if (!material) {
      throw new DomainError('Material no encontrado');
    }

    // Verificar que el material no tenga inventario inicializado
    if (material.cantidadActual !== null && material.cantidadActual > 0) {
      throw new DomainError('El material ya tiene inventario inicializado. Use la función de compra para agregar más stock.');
    }

    // Calcular valores iniciales
    const valor_total_inventario = cantidad_inicial * costo_unitario_inicial;
    const costo_promedio_ponderado = costo_unitario_inicial; // Para el stock inicial, CPP = costo unitario
    const fecha_procesada = fecha_ingreso ? new Date(fecha_ingreso) : new Date();

    // Actualizar el material con los valores iniciales
    material.update({
      cantidadActual: cantidad_inicial,
      valorTotalInventario: valor_total_inventario,
      costoPromedioPonderado: costo_promedio_ponderado,
      precioCompra: costo_unitario_inicial // Actualizar también el precio de compra
    });

    // Guardar los cambios en la base de datos
    await this.repository.update(material);

    // Registrar la inicialización como una entrada de inventario
    await this.repository.insertRegistroProduccion({
      lote_id: `INIT-${Date.now()}`, // Lote especial para inicialización
      material_id,
      cantidad: cantidad_inicial,
      costoUnitario: costo_unitario_inicial,
      costoTotal: valor_total_inventario,
      fecha: fecha_procesada
    });

    return {
      material,
      cantidad_inicial,
      valor_total_inventario,
      costo_promedio_ponderado,
      fecha_ingreso: fecha_procesada
    };
  }

  private validateInput(cantidad_inicial: number, costo_unitario_inicial: number, fecha_ingreso?: string): void {
    if (cantidad_inicial <= 0) {
      throw new DomainError('La cantidad inicial debe ser mayor a 0');
    }
    if (isNaN(cantidad_inicial)) {
      throw new DomainError('La cantidad inicial debe ser un número válido');
    }
    if (costo_unitario_inicial <= 0) {
      throw new DomainError('El costo unitario inicial debe ser mayor a 0');
    }
    if (isNaN(costo_unitario_inicial)) {
      throw new DomainError('El costo unitario inicial debe ser un número válido');
    }
    if (fecha_ingreso) {
      const fecha = new Date(fecha_ingreso);
      if (isNaN(fecha.getTime())) {
        throw new DomainError('La fecha de ingreso debe ser una fecha válida');
      }
      // Verificar que la fecha no sea futura
      if (fecha > new Date()) {
        throw new DomainError('La fecha de ingreso no puede ser futura');
      }
    }
  }
}