/**
 * @swagger
 * /api/inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Lista inventario
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Inventory]
 *     summary: Crea un ítem de inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, OBSOLETE]
 *               unitOfMeasure:
 *                 type: string
 *               itemType:
 *                 type: string
 *                 enum: [PRODUCT, MATERIAL]
 *             required: [companyId, name, category, status, unitOfMeasure, itemType]
 *     responses:
 *       201:
 *         description: Creado
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Conflicto de unicidad
 */

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     tags: [Inventory]
 *     summary: Obtiene un inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [Inventory]
 *     summary: Actualiza un inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   delete:
 *     tags: [Inventory]
 *     summary: Elimina un inventario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/materials:
 *   get:
 *     tags: [Materials]
 *     summary: Lista materiales
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Materials]
 *     summary: Crea detalles de material para un inventario MATERIAL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precioCompra:
 *                 type: number
 *               proveedor:
 *                 type: string
 *                 nullable: true
 *               inventarioId:
 *                 type: string
 *             required: [precioCompra, inventarioId]
 *     responses:
 *       201:
 *         description: Creado
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Conflicto (FK)
 */

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     tags: [Materials]
 *     summary: Obtiene un material por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [Materials]
 *     summary: Actualiza un material por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   delete:
 *     tags: [Materials]
 *     summary: Elimina un material por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/materials/{id}/compra:
 *   post:
 *     tags: [Purchasing]
 *     summary: Registra compra de un material y actualiza inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               supplierId: { type: string }
 *               cantidad_comprada: { type: number }
 *               precio_unitario_compra: { type: number }
 *               invoiceNumber: { type: string, nullable: true }
 *             required: [companyId, supplierId, cantidad_comprada, precio_unitario_compra]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */

/**
 * @swagger
 * /api/materials/{id}/consumo:
 *   post:
 *     tags: [Production]
 *     summary: Registra consumo de un material en un lote de producción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               lote_id: { type: string }
 *               cantidad_consumida: { type: number }
 *             required: [companyId, lote_id, cantidad_consumida]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */

/**
 * @swagger
 * /api/materials/{id}/inicializar:
 *   post:
 *     tags: [Ledger]
 *     summary: Inicializa stock de un material con un asiento INIT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               cantidad_inicial: { type: number }
 *               costo_unitario_inicial: { type: number }
 *               fecha_ingreso: { type: string, nullable: true }
 *             required: [companyId, cantidad_inicial, costo_unitario_inicial]
 *     responses:
 *       200: { description: OK }
 *       400: { description: Error de validación }
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Lista productos
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Products]
 *     summary: Crea un producto y opcionalmente asocia materiales (BOM)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *               precio:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 nullable: true
 *               materials:
 *                 type: array
 *                 items:
 *                   type: object
 *             required: [nombre, precio]
 *     responses:
 *       201:
 *         description: Creado
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Conflicto de unicidad
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtiene un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [Products]
 *     summary: Actualiza un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de validación
 *       404:
 *         description: No encontrado
 *   delete:
 *     tags: [Products]
 *     summary: Elimina un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /api/products/{id}/materials:
 *   get:
 *     tags: [BOM]
 *     summary: Lista materiales asociados a un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     tags: [BOM]
 *     summary: Reemplaza la lista completa de materiales de un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materials:
 *                 type: array
 *                 items:
 *                   type: object
 *             required: [materials]
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [BOM]
 *     summary: Agrega un material al producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materialId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             required: [materialId, quantity]
 *     responses:
 *       201:
 *         description: Asociado
 */

/**
 * @swagger
 * /api/products/{id}/materials/{materialId}:
 *   delete:
 *     tags: [BOM]
 *     summary: Elimina un material del producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */

export {};
