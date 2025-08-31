import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../../shared/container";
import { InicializarInventarioMaterialUseCase } from "../../../../../modules/inventory/application/use-cases";
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
    const required = ["cantidad_inicial", "costo_unitario_inicial"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validar tipos y valores
    if (typeof body.cantidad_inicial !== 'number' || body.cantidad_inicial <= 0) {
      return createErrorResponse('cantidad_inicial debe ser un número mayor a 0', 400);
    }

    if (typeof body.costo_unitario_inicial !== 'number' || body.costo_unitario_inicial <= 0) {
      return createErrorResponse('costo_unitario_inicial debe ser un número mayor a 0', 400);
    }

    // Validar fecha si se proporciona
    if (body.fecha_ingreso && typeof body.fecha_ingreso !== 'string') {
      return createErrorResponse('fecha_ingreso debe ser una cadena de texto válida', 400);
    }

    // Ejecutar el caso de uso
    const useCase = container.resolve(InicializarInventarioMaterialUseCase);
    const resultado = await useCase.execute({
      material_id: id,
      cantidad_inicial: body.cantidad_inicial,
      costo_unitario_inicial: body.costo_unitario_inicial,
      fecha_ingreso: body.fecha_ingreso,
    });

    // Get inventory data
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const inventoryData = await prisma.inventory.findUnique({
      where: { id: resultado.material.inventarioId.getValue() }
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
        inventario: inventoryData ? {
          id: inventoryData.id,
          nombre: inventoryData.nombre,
          categoria: inventoryData.categoria,
          estado: inventoryData.estado,
          unidadMedida: inventoryData.unidad_medida,
        } : null,
        createdAt: resultado.material.createdAt,
        updatedAt: resultado.material.updatedAt,
      },
      inicializacion: {
        cantidad_inicial: resultado.cantidad_inicial,
        valor_total_inventario: resultado.valor_total_inventario,
        costo_promedio_ponderado: resultado.costo_promedio_ponderado,
        fecha_ingreso: resultado.fecha_ingreso.toISOString(),
      }
    };

    return createSuccessResponse(response, 200);

  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/materials/${id}/inicializar:`, error);
    
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