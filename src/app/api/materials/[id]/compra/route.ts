import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../../shared/container";
import { RegistrarCompraMaterialUseCase } from "../../../../../modules/inventory/application/use-cases";
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
    const required = ["cantidad_comprada", "precio_unitario_compra"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validar tipos y valores
    if (typeof body.cantidad_comprada !== 'number' || body.cantidad_comprada <= 0) {
      return createErrorResponse('cantidad_comprada debe ser un número mayor a 0', 400);
    }

    if (typeof body.precio_unitario_compra !== 'number' || body.precio_unitario_compra <= 0) {
      return createErrorResponse('precio_unitario_compra debe ser un número mayor a 0', 400);
    }

    // Ejecutar el caso de uso
    const useCase = container.resolve(RegistrarCompraMaterialUseCase);
    const resultado = await useCase.execute({
      material_id: id,
      cantidad_comprada: body.cantidad_comprada,
      precio_unitario_compra: body.precio_unitario_compra,
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
      compra: {
        valor_compra: resultado.valor_compra,
        nueva_cantidad_total: resultado.nueva_cantidad_total,
        nuevo_valor_total_inventario: resultado.nuevo_valor_total_inventario,
        nuevo_cpp: resultado.nuevo_cpp,
      }
    };

    return createSuccessResponse(response, 200);

  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/materials/${id}/compra:`, error);
    
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