import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../shared/container";
import { GetProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from "../../../../modules/products/application/use-cases";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

configureContainer();

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtiene un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(GetProductUseCase);
    const product = await useCase.execute(id);
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

    return NextResponse.json({
      id: product.id.getValue(),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en GET /api/products/${id}:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "No se pudo obtener el producto" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Actualiza un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 *       404: { description: No encontrado }
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron datos para actualizar" },
        { status: 400 }
      );
    }

    if (body.precio !== undefined && (typeof body.precio !== 'number' || body.precio < 0)) {
      return NextResponse.json({ error: 'precio debe ser un número >= 0' }, { status: 400 });
    }

    const { id } = await params;
    if (body.materials !== undefined && !Array.isArray(body.materials)) {
      return NextResponse.json({ error: 'materials debe ser un arreglo' }, { status: 400 });
    }
    const useCase = container.resolve(UpdateProductUseCase);
    const product = await useCase.execute({
      id,
      nombre: body.nombre,
      descripcion: body.descripcion ?? null,
      precio: body.precio,
      categoria: body.categoria ?? null,
      materials: body.materials,
    });

    return NextResponse.json({
      id: product.id.getValue(),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en PUT /api/products/${id}:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "No se pudo actualizar el producto" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Elimina un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No encontrado }
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(DeleteProductUseCase);
    await useCase.execute(id);

    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en DELETE /api/products/${id}:`, error);

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "No se pudo eliminar el producto" },
      { status: 500 }
    );
  }
}
