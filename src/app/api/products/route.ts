import "reflect-metadata";
import { Prisma } from "@prisma/client";
import { container, configureContainer } from "../../../shared/container";
import { GetAllProductsUseCase, CreateProductUseCase } from "../../../modules/products/application/use-cases";
import { DomainError } from "../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await configureContainer();
    const useCase = container.resolve(GetAllProductsUseCase);
    const products = await useCase.execute();

    const response = products.map((p) => ({
      id: p.id.getValue(),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return createSuccessResponse(response);
  } catch (error: unknown) {
    console.error('Error en GET /api/products:', error);
    return createErrorResponse('No se pudieron obtener los productos', 500);
  }
}

export async function POST(req: Request) {
  try {
    await configureContainer();
    const body = await req.json();

    const required = ["nombre", "precio"] as const;
    for (const field of required) {
      if (!body[field]) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    if (typeof body.precio !== 'number' || body.precio < 0) {
      return createErrorResponse('precio debe ser un número >= 0', 400);
    }

    const descripcion = body.descripcion === "" ? null : body.descripcion ?? null;
    const categoria = body.categoria === "" ? null : body.categoria ?? null;

    // Validación opcional de materials
    if (body.materials !== undefined && !Array.isArray(body.materials)) {
      return createErrorResponse('materials debe ser un arreglo', 400);
    }

    const useCase = container.resolve(CreateProductUseCase);
    const product = await useCase.execute({
      nombre: body.nombre,
      descripcion,
      precio: body.precio,
      categoria,
      materials: body.materials,
    });

    return createSuccessResponse({
      id: product.id.getValue(),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }, 201);

  } catch (error: unknown) {
    console.error('Error en POST /api/products:', error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    }

    if (error instanceof DomainError) {
      return createErrorResponse(error.message, 400);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") ?? "desconocido";
        return createErrorResponse(`Ya existe un producto con este ${target}`, 409);
      }
    }

    return createErrorResponse("Error interno del servidor", 500);
  }
}
