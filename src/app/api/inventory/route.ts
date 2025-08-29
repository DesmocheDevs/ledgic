import "reflect-metadata";
import { Prisma } from "@prisma/client";
import { container, configureContainer } from "../../../shared/container";
import { GetAllInventoryUseCase, CreateInventoryUseCase } from "../../../modules/inventory/application/use-cases";
import { EstadoInventario } from "../../../modules/inventory/domain";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";

// Asegura runtime Node y evita cualquier intento de prerender
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await configureContainer();
    const useCase = container.resolve(GetAllInventoryUseCase);
    const inventories = await useCase.execute();
    
    const response = inventories.map((inventory) => ({
      id: inventory.id.getValue(),
      nombre: inventory.nombre,
      categoria: inventory.categoria,
      estado: inventory.estado,
      unidadMedida: inventory.unidadMedida,
      proveedor: inventory.proveedor,
      tipo: inventory.tipo,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    }));
    
    return createSuccessResponse(response);
  } catch (error: unknown) {
    console.error('Error en GET /api/inventory:', error);
    return createErrorResponse('No se pudieron obtener los inventarios', 500);
  }
}

export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();

    // Validación básica del payload
    const required = ["nombre", "categoria", "estado", "unidadMedida"] as const;
    for (const field of required) {
      if (!body[field] || typeof body[field] !== "string") {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validaciones específicas
    if (body.nombre.trim().length < 2) {
      return createErrorResponse("Nombre debe tener al menos 2 caracteres", 400);
    }
    if (body.categoria.trim().length < 2) {
      return createErrorResponse("Categoría debe tener al menos 2 caracteres", 400);
    }
    if (body.unidadMedida.trim().length === 0) {
      return createErrorResponse("Unidad de medida es requerida", 400);
    }
    if (body.unidadMedida.length > 50) {
      return createErrorResponse("Unidad de medida no puede exceder 50 caracteres", 400);
    }
    if (!Object.values(EstadoInventario).includes(body.estado)) {
      return createErrorResponse("Estado inválido", 400);
    }
    if (body.proveedor !== undefined && body.proveedor !== null && body.proveedor.trim().length < 2) {
      return createErrorResponse("Proveedor debe tener al menos 2 caracteres", 400);
    }
    if (body.tipo !== undefined && body.tipo !== null && body.tipo.trim().length < 2) {
      return createErrorResponse("Tipo debe tener al menos 2 caracteres", 400);
    }

    // Normalización
    const proveedor = body.proveedor === "" ? null : body.proveedor;
    const tipo = body.tipo === "" ? null : body.tipo;

    const useCase = container.resolve(CreateInventoryUseCase);
    const inventory = await useCase.execute({
      nombre: body.nombre,
      categoria: body.categoria,
      estado: body.estado,
      unidadMedida: body.unidadMedida,
      proveedor,
      tipo,
    });

    // Solo si no hubo excepción, se construye y retorna la respuesta
    return createSuccessResponse({
      id: inventory.id.getValue(),
      nombre: inventory.nombre,
      categoria: inventory.categoria,
      estado: inventory.estado,
      unidadMedida: inventory.unidadMedida,
      proveedor: inventory.proveedor,
      tipo: inventory.tipo,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    }, 201);

  } catch (error: unknown) {
    console.error('Error en POST /api/inventory:', error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    // Errores de dominio
    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    // Errores de Prisma (violación de unicidad u otros)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") ?? "desconocido";
        const errorMessage = `Ya existe un inventario con este ${target}`;
        return createErrorResponse(errorMessage, 409);
      }
    }

    // Otros errores
    return createErrorResponse("Error interno del servidor", 500);
  }
}