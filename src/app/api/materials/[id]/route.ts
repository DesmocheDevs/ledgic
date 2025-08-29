import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../shared/container";
import { GetMaterialUseCase, UpdateMaterialUseCase, DeleteMaterialUseCase } from "../../../../modules/inventory/application/use-cases";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

configureContainer();

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(GetMaterialUseCase);
    const material = await useCase.execute(id);
    if (!material) return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 });

    return NextResponse.json({
      id: material.id.getValue(),
      precioCompra: material.precioCompra,
      proveedor: material.proveedor,
      inventarioId: material.inventarioId.getValue(),
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en GET /api/materials/${id}:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "No se pudo obtener el material" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron datos para actualizar" },
        { status: 400 }
      );
    }

    if (body.precioCompra !== undefined && (typeof body.precioCompra !== 'number' || body.precioCompra < 0)) {
      return NextResponse.json({ error: 'precioCompra debe ser un número >= 0' }, { status: 400 });
    }

    if (body.proveedor !== undefined && body.proveedor !== null && typeof body.proveedor !== 'string') {
      return NextResponse.json({ error: 'proveedor debe ser string o null' }, { status: 400 });
    }

    const { id } = await params;
    const useCase = container.resolve(UpdateMaterialUseCase);
    const material = await useCase.execute({ id, precioCompra: body.precioCompra, proveedor: body.proveedor ?? null });

    return NextResponse.json({
      id: material.id.getValue(),
      precioCompra: material.precioCompra,
      proveedor: material.proveedor,
      inventarioId: material.inventarioId.getValue(),
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en PUT /api/materials/${id}:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "No se pudo actualizar el material" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(DeleteMaterialUseCase);
    await useCase.execute(id);

    return NextResponse.json({ message: "Material eliminado correctamente" });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en DELETE /api/materials/${id}:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "No se pudo eliminar el material" },
      { status: 500 }
    );
  }
}
