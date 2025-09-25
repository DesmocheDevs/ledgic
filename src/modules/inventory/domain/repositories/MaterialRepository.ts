import { Material } from '../entities/Material';
import { UUID } from '../../../../shared/domain/value-objects/UUID';

export interface RegistroProduccionData {
  lote_id: string;
  material_id: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  fecha: Date;
}

export interface MaterialRepository {
  findById(id: UUID): Promise<Material | null>;
  findAll(): Promise<Material[]>;
  create(material: Material): Promise<void>;
  update(material: Material): Promise<void>;
  delete(id: UUID): Promise<void>;
  insertRegistroProduccion(data: RegistroProduccionData): Promise<void>;
}
