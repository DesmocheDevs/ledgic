export interface MaterialDTO {
  id: string;
  precioCompra: number; // Prisma Decimal mapped to number in app layer
  proveedor: string | null;
  cantidadActual: number | null;
  valorTotalInventario: number | null;
  costoPromedioPonderado: number | null;
  inventarioId: string;
  createdAt: Date;
  updatedAt: Date;
}
