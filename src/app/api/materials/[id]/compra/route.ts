import "reflect-metadata";
// NextResponse no se usa en este handler
import { container, configureContainer } from "../../../../../shared/container";
import { CreatePurchaseUseCase, CompletePurchaseUseCase } from "../../../../../modules/purchasing/application/use-cases";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/materials/{id}/compra:
 *   post:
 *     tags: [Purchasing]
 *     summary: Registra compra de un material y actualiza inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               supplierId: { type: string }
 *               cantidad_comprada: { type: number }
 *               precio_unitario_compra: { type: number }
 *               invoiceNumber: { type: string, nullable: true }
 *             required: [companyId, supplierId, cantidad_comprada, precio_unitario_compra]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await configureContainer();
    const { id } = await params;
    const body = await req.json();

    // Validación básica del payload
    const required = ["cantidad_comprada", "precio_unitario_compra"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validar tipos y valores
    if (typeof body.cantidad_comprada !== 'number' || body.cantidad_comprada <= 0) {
      return createErrorResponse('cantidad_comprada debe ser un número mayor a 0', 400);
    }

    if (typeof body.precio_unitario_compra !== 'number' || body.precio_unitario_compra <= 0) {
      return createErrorResponse('precio_unitario_compra debe ser un número mayor a 0', 400);
    }

    // Ejecutar el caso de uso
    // Map legacy fields to purchasing DTO
    const qty = body.cantidad_comprada as number;
    const unit = body.precio_unitario_compra as number;
    const companyId = body.companyId as string; // expect provided by client
    const supplierId = body.supplierId as string; // expect provided by client

    const create = container.resolve(CreatePurchaseUseCase);
    const complete = container.resolve(CompletePurchaseUseCase);
    const purchase = await create.execute({
      data: {
        companyId,
        supplierId,
        invoiceNumber: body.invoiceNumber ?? null,
        totalAmount: (qty * unit).toString(),
      },
      items: [{ materialId: id, quantity: qty.toString(), unitPrice: unit.toString(), itemTotal: (qty * unit).toString() }],
    });

    await complete.execute(purchase.id);

    // Preparar respuesta
  const response = { purchaseId: purchase.id };

    return createSuccessResponse(response, 200);

  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/materials/${id}/compra:`, error);
    
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