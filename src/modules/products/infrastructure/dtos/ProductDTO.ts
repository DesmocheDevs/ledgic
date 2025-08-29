export interface ProductDTO {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number; // Prisma Decimal mapped to number in app layer
  categoria: string | null;
  createdAt: Date;
  updatedAt: Date;
}
