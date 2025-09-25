/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { container, configureContainer, TOKENS } from "../../../../../shared/container";
import type { PrismaClient } from "@prisma/client";
import { DomainError } from "../../../../../shared/domain/errors/DomainError";
import { createErrorResponse, createSuccessResponse } from "../../../../../shared/infrastructure/utils/errorResponse";
import type { LedgerRepository } from "../../../../../modules/ledger/domain/repositories/LedgerRepository";
import type { WacService } from "../../../../../modules/ledger/domain/services/WacService";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/materials/{id}/inicializar:
 *   post:
 *     tags: [Ledger]
 *     summary: Inicializa stock de un material con un asiento INIT
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
 *               cantidad_inicial: { type: number }
 *               costo_unitario_inicial: { type: number }
 *               fecha_ingreso: { type: string, nullable: true }
 *             required: [companyId, cantidad_inicial, costo_unitario_inicial]
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
  const required = ["companyId", "cantidad_inicial", "costo_unitario_inicial"] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return createErrorResponse(`Campo inválido o faltante: ${field}`, 400);
      }
    }

    // Validar tipos y valores
    if (typeof body.cantidad_inicial !== 'number' || body.cantidad_inicial <= 0) {
      return createErrorResponse('cantidad_inicial debe ser un número mayor a 0', 400);
    }

    if (typeof body.costo_unitario_inicial !== 'number' || body.costo_unitario_inicial <= 0) {
      return createErrorResponse('costo_unitario_inicial debe ser un número mayor a 0', 400);
    }

    // Validar fecha si se proporciona
    if (body.fecha_ingreso && typeof body.fecha_ingreso !== 'string') {
      return createErrorResponse('fecha_ingreso debe ser una cadena de texto válida', 400);
    }

    const companyId = body.companyId as string;
    const qty = body.cantidad_inicial as number;
    const unit = body.costo_unitario_inicial as number;

    // Post ledger INIT and apply WAC entry
    const ledger = container.resolve<LedgerRepository>(TOKENS.LedgerRepository);
    const wac = container.resolve<WacService>(TOKENS.WacService);
    await ledger.post({
      companyId,
      inventoryId: id,
      type: "INIT",
      quantity: qty.toString(),
      unitCost: unit.toString(),
      referenceId: body.fecha_ingreso ?? null,
    });
    await wac.applyEntry({ inventoryId: id, quantity: qty.toString(), unitCost: unit.toString() });

    // Obtener inventario actualizado
    const prisma = container.resolve<PrismaClient>(TOKENS.PrismaClient);
    const inventoryData = await prisma.inventory.findUnique({ where: { id } });

    // Preparar respuesta
    const response = {
      inventory: inventoryData
        ? {
            id: inventoryData.id,
            currentQuantity: (inventoryData as any).currentQuantity,
            totalInventoryValue: (inventoryData as any).totalInventoryValue,
            weightedAverageCost: (inventoryData as any).weightedAverageCost,
          }
        : null,
    };

    return createSuccessResponse(response, 200);

  } catch (error: unknown) {
    const { id } = await params;
    console.error(`Error en POST /api/materials/${id}/inicializar:`, error);
    
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