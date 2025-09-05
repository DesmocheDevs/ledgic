export type InventoryStatusDTO = 'ACTIVE' | 'INACTIVE' | 'OBSOLETE';
export type ItemTypeDTO = 'PRODUCT' | 'MATERIAL';

export interface InventoryDTO {
  id: string;
  companyId: string;
  name: string;
  category: string;
  status: InventoryStatusDTO;
  unitOfMeasure: string;
  itemType: ItemTypeDTO;
  createdAt: Date;
  updatedAt: Date;
}