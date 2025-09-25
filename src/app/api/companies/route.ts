import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: Lista compañías
 *     responses:
 *       200:
 *         description: OK
 */
export async function GET() {
  // Placeholder implementation; replace with real use case when ready
  return NextResponse.json([], { status: 200 });
}

/**
 * @swagger
 * /api/companies:
 *   post:
 *     tags: [Companies]
 *     summary: Crea una compañía
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *             required: [name, type]
 *     responses:
 *       201:
 *         description: Creado
 */
export async function POST(req: Request) {
  // Placeholder implementation; validate and create in future
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ message: "Company created (stub)", body }, { status: 201 });
}
