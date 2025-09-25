import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Obtiene una compañía
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
  const { id } = await params;
  return NextResponse.json({ id, name: "Stub Co" }, { status: 200 });
}

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     tags: [Companies]
 *     summary: Actualiza una compañía
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ id, ...body }, { status: 200 });
}

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     tags: [Companies]
 *     summary: Elimina una compañía
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Eliminado }
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ deleted: id }, { status: 200 });
}
