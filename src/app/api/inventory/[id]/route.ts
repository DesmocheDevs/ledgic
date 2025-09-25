import "reflect-metadata";
import { NextResponse } from "next/server";
import { container, configureContainer } from "../../../../shared/container";
import { GetInventoryUseCase, UpdateInventoryUseCase, DeleteInventoryUseCase } from "../../../../modules/inventory/application/use-cases";
import { EstadoInventario } from "../../../../modules/inventory/domain";
import { DomainError } from "../../../../shared/domain/errors/DomainError";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Configurar el contenedor de dependencias
configureContainer();

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     tags: [Inventory]
 *     summary: Obtiene un inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: OK }
 *       404: { description: No encontrado }
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(GetInventoryUseCase);
    const inventory = await useCase.execute(id);
    
    const response = {
      id: inventory.id.getValue(),
      nombre: inventory.nombre,
      categoria: inventory.categoria,
      estado: inventory.estado,
      unidadMedida: inventory.unidadMedida,
      proveedor: inventory.proveedor,
      tipo: inventory.tipo,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    };
    
    return NextResponse.json(response);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en GET /api/inventory/${id}:`, error);
    
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "No se pudo obtener el inventario" }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     tags: [Inventory]
 *     summary: Actualiza un inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 *       404: { description: No encontrado }
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    
    // Validar que se proporcionó al menos un campo para actualizar
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron datos para actualizar" }, 
        { status: 400 }
      );
    }

    // Validaciones específicas para campos que se están actualizando
    if (body.nombre !== undefined && body.nombre.trim().length < 2) {
      return NextResponse.json(
        { error: "Nombre debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }
    if (body.categoria !== undefined && body.categoria.trim().length < 2) {
      return NextResponse.json(
        { error: "Categoría debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }
    if (body.unidadMedida !== undefined) {
      if (body.unidadMedida.trim().length === 0) {
        return NextResponse.json(
          { error: "Unidad de medida es requerida" },
          { status: 400 }
        );
      }
      if (body.unidadMedida.length > 50) {
        return NextResponse.json(
          { error: "Unidad de medida no puede exceder 50 caracteres" },
          { status: 400 }
        );
      }
    }
    if (body.estado !== undefined && !Object.values(EstadoInventario).includes(body.estado)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }
    if (body.proveedor !== undefined && body.proveedor !== null && body.proveedor.trim().length < 2) {
      return NextResponse.json(
        { error: "Proveedor debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }
    if (body.tipo !== undefined && body.tipo !== null && body.tipo.trim().length < 2) {
      return NextResponse.json(
        { error: "Tipo debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }

    // Normalización
    if (body.proveedor === "") body.proveedor = null;
    if (body.tipo === "") body.tipo = null;
    
    const { id } = await params;
    const useCase = container.resolve(UpdateInventoryUseCase);
    const inventory = await useCase.execute(id, body);
    
    const response = {
      id: inventory.id.getValue(),
      nombre: inventory.nombre,
      categoria: inventory.categoria,
      estado: inventory.estado,
      unidadMedida: inventory.unidadMedida,
      proveedor: inventory.proveedor,
      tipo: inventory.tipo,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    };
    
    return NextResponse.json(response);
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en PUT /api/inventory/${id}:`, error);
    
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "No se pudo actualizar el inventario" }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     tags: [Inventory]
 *     summary: Elimina un inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No encontrado }
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const useCase = container.resolve(DeleteInventoryUseCase);
    await useCase.execute(id);
    
    return NextResponse.json({ message: "Inventario eliminado correctamente" });
  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en DELETE /api/inventory/${id}:`, error);
    
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "No se pudo eliminar el inventario" }, 
      { status: 500 }
    );
  }
}