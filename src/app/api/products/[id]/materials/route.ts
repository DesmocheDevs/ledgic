import 'reflect-metadata';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { container, configureContainer } from '../../../../../shared/container';
import { GetProductMaterialsUseCase, SetProductMaterialsUseCase, AddProductMaterialUseCase } from '../../../../../modules/products/application/use-cases';
import { DomainError } from '../../../../../shared/domain/errors/DomainError';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

configureContainer();

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(GetProductMaterialsUseCase);
    const items = await useCase.execute(id);

    const response = items.map((i) => ({
      productId: i.productId.getValue(),
      materialId: i.materialId.getValue(),
      cantidad: i.cantidad,
      unidadMedida: i.unidadMedida,
    }));

    return NextResponse.json(response);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en GET /api/products/${id}/materials:`, error);
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'No se pudieron obtener los materiales del producto' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || !Array.isArray(body.materials)) {
      return NextResponse.json({ error: 'Debe enviar materials: Array<...>' }, { status: 400 });
    }

    const useCase = container.resolve(SetProductMaterialsUseCase);
    await useCase.execute(id, body.materials);

    // Devuelve el set final tras el reemplazo
    const getUseCase = container.resolve(GetProductMaterialsUseCase);
    const items = await getUseCase.execute(id);
    const response = items.map((i) => ({
      productId: i.productId.getValue(),
      materialId: i.materialId.getValue(),
      cantidad: i.cantidad,
      unidadMedida: i.unidadMedida,
    }));

    return NextResponse.json(response);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en PUT /api/products/${id}/materials:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'No se pudieron actualizar los materiales del producto' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const required = ['materialId', 'cantidad'] as const;
    for (const f of required) {
      if (body[f] === undefined || body[f] === null) {
        return NextResponse.json({ error: `Campo inválido o faltante: ${f}` }, { status: 400 });
      }
    }

    const useCase = container.resolve(AddProductMaterialUseCase);
    await useCase.execute({
      productId: id,
      materialId: body.materialId,
      cantidad: body.cantidad,
      unidadMedida: body.unidadMedida ?? null,
    });

    return NextResponse.json({ message: 'Material agregado al producto' }, { status: 201 });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/products/${id}/materials:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Ya existe este material en el producto' }, { status: 409 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Producto o material no encontrado' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'No se pudo agregar el material al producto' }, { status: 500 });
  }
}
