export { CreateInventoryUseCase } from './CreateInventoryUseCase';
export { GetInventoryUseCase } from './GetInventoryUseCase';
export { GetAllInventoryUseCase } from './GetAllInventoryUseCase';
export { UpdateInventoryUseCase } from './UpdateInventoryUseCase';
export { DeleteInventoryUseCase } from './DeleteInventoryUseCase';

export { CreateMaterialUseCase } from './CreateMaterialUseCase';
export { GetMaterialUseCase } from './GetMaterialUseCase';
export { GetAllMaterialsUseCase } from './GetAllMaterialsUseCase';
export { UpdateMaterialUseCase } from './UpdateMaterialUseCase';
export { DeleteMaterialUseCase } from './DeleteMaterialUseCase';
export { RegistrarCompraMaterialUseCase } from './RegistrarCompraMaterialUseCase';
export { RegistrarConsumoMaterialUseCase } from './RegistrarConsumoMaterialUseCase';
export { InicializarInventarioMaterialUseCase } from './InicializarInventarioMaterialUseCase';

export type { CreateInventoryRequest } from './CreateInventoryUseCase';
export type { UpdateInventoryRequest } from './UpdateInventoryUseCase';
export type { RegistrarCompraRequest, RegistrarCompraResponse } from './RegistrarCompraMaterialUseCase';
export type { RegistrarConsumoRequest, RegistrarConsumoResponse } from './RegistrarConsumoMaterialUseCase';
export type { InicializarInventarioRequest, InicializarInventarioResponse } from './InicializarInventarioMaterialUseCase';