import 'reflect-metadata';
import { NextResponse } from 'next/server';
import { container, configureContainer } from '../../../../../../shared/container';
import { RemoveProductMaterialUseCase } from '../../../../../../modules/products/application/use-cases';
import { DomainError } from '../../../../../../shared/domain/errors/DomainError';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

configureContainer();

/**
 * @swagger
 * /api/products/{id}/materials/{materialId}:
 *   delete:
 *     tags: [BOM]
 *     summary: Elimina un material del producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Eliminado }
 *       404: { description: No encontrado }
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; materialId: string }> }) {
  try {
    const { id, materialId } = await params;
    const useCase = container.resolve(RemoveProductMaterialUseCase);
    await useCase.execute(id, materialId);
    return NextResponse.json({ message: 'Material eliminado del producto' }, { status: 200 });
  } catch (error: unknown) {
    const { id, materialId } = await params;
    console.error(`Error en DELETE /api/products/${id}/materials/${materialId}:`, error);
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'No se pudo eliminar el material del producto' }, { status: 500 });
  }
}
