import { Material } from '../entities/Material';
import { UUID } from '../../../../shared/domain/value-objects/UUID';

export interface MaterialRepository {
  findById(id: UUID): Promise<Material | null>;
  findAll(): Promise<Material[]>;
  create(material: Material): Promise<void>;
  update(material: Material): Promise<void>;
  delete(id: UUID): Promise<void>;
}
