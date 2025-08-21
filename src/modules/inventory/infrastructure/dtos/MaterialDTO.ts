export interface MaterialDTO {
  id: string;
  precioCompra: number; // Prisma Decimal mapped to number in app layer
  proveedor: string | null;
  inventarioId: string;
  createdAt: Date;
  updatedAt: Date;
}
