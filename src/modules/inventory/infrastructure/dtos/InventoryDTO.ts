export type EstadoInventarioDTO = 'ACTIVO' | 'INACTIVO' | 'DESCONTINUADO';

export interface InventoryDTO {
  id: string;
  nombre: string;
  categoria: string;
  estado: EstadoInventarioDTO;
  unidadMedida: string;
  proveedor: string | null;
  tipo: string | null;
  createdAt: Date;
  updatedAt: Date;
}