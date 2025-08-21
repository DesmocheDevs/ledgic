import { Product } from '../entities/Product';
import { ProductMaterial } from '../entities/ProductMaterial';
import { UUID } from '../../../../shared/domain/value-objects/UUID';

export interface ProductRepository {
	findById(id: UUID): Promise<Product | null>;
	findAll(): Promise<Product[]>;
	create(product: Product): Promise<void>;
	update(product: Product): Promise<void>;
	delete(id: UUID): Promise<void>;

	// Product materials (BOM)
	getMaterials(productId: UUID): Promise<ProductMaterial[]>;
	setMaterials(productId: UUID, items: ProductMaterial[]): Promise<void>;
	addMaterial(item: ProductMaterial): Promise<void>;
	removeMaterial(productId: UUID, materialId: UUID): Promise<void>;
}

