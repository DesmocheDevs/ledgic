export interface ProductMaterialDTO {
  productId: string;
  materialId: string;
  cantidad: number; // Decimal to number
  unidadMedida: string | null;
}
