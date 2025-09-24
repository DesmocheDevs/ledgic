import { z } from "zod";

export const UpsertBOMSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    materialId: z.string(),
    quantity: z.string(),
    unitOfMeasure: z.string().optional(),
  })),
});

export const CreateLotSchema = z.object({
  companyId: z.string(),
  productId: z.string(),
  lotCode: z.string(),
  plannedQuantity: z.string(),
});

export const ConsumeMaterialsSchema = z.object({
  usePlanned: z.boolean().optional(),
  items: z.array(z.object({
    materialId: z.string(),
    quantity: z.string(),
  })).optional(),
});

export const FinishLotSchema = z.object({
  producedQuantity: z.string(),
  extraCosts: z.object({
    labor: z.string().optional(),
    machine: z.string().optional(),
    overhead: z.string().optional(),
    other: z.string().optional(),
  }).optional(),
});
