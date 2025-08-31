import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../../shared/container";
import { RegistrarConsumoMaterialUseCase } from "../../../../../modules/inventory/application/use-cases";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await configureContainer();
    const { id } = await params;
    const body = await req.json();

    // Validación básica del payload
    const required = ["cantidad_consumida", "lote_id"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validar tipos y valores
    if (typeof body.cantidad_consumida !== 'number' || body.cantidad_consumida <= 0) {
      return createErrorResponse('cantidad_consumida debe ser un número mayor a 0', 400);
    }

    if (typeof body.lote_id !== 'string' || body.lote_id.trim().length === 0) {
      return createErrorResponse('lote_id debe ser una cadena de texto válida', 400);
    }

    // Ejecutar el caso de uso
    const useCase = container.resolve(RegistrarConsumoMaterialUseCase);
    const resultado = await useCase.execute({
      material_id: id,
      cantidad_consumida: body.cantidad_consumida,
      lote_id: body.lote_id,
    });

    // Preparar respuesta
    const response = {
      material: {
        id: resultado.material.id.getValue(),
        precioCompra: resultado.material.precioCompra,
        proveedor: resultado.material.proveedor,
        cantidadActual: resultado.material.cantidadActual,
        valorTotalInventario: resultado.material.valorTotalInventario,
        costoPromedioPonderado: resultado.material.costoPromedioPonderado,
        inventarioId: resultado.material.inventarioId.getValue(),
        createdAt: resultado.material.createdAt,
        updatedAt: resultado.material.updatedAt,
      },
      consumo: {
        costo_total_consumo: resultado.costo_total_consumo,
        nueva_cantidad_total: resultado.nueva_cantidad_total,
        nuevo_valor_total_inventario: resultado.nuevo_valor_total_inventario,
        costo_promedio_ponderado: resultado.costo_promedio_ponderado,
        lote_id: body.lote_id,
      }
    };

    return createSuccessResponse(response, 200);

  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/materials/${id}/consumo:`, error);
    
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    return createErrorResponse("Error interno del servidor", 500);
  }
}