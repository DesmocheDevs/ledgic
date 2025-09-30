-- CreateTable
CREATE TABLE "public"."catalogo_general_categorias_procedimientos_calculos" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "grupo" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogo_general_categorias_procedimientos_calculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."catalogo_personas_clientes_usuarios" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogo_personas_clientes_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personas" (
    "id" SERIAL NOT NULL,
    "primer_nombre" VARCHAR(50) NOT NULL,
    "segundo_nombre" VARCHAR(50),
    "primer_apellido" VARCHAR(50) NOT NULL,
    "segundo_apellido" VARCHAR(50),
    "nombre_completo" VARCHAR(200) NOT NULL,
    "direccion" VARCHAR(255),
    "municipio" VARCHAR(100),
    "celular" VARCHAR(20),
    "correo" VARCHAR(100),
    "tipo_entidad_catalogo_persona" INTEGER NOT NULL,
    "tipo_persona_catalogo_persona" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "id_persona" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ventas" (
    "id" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "company_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(12,4) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."detalle_ventas" (
    "id" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(12,4) NOT NULL,
    "subtotal" DECIMAL(12,4) NOT NULL,

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."facturas" (
    "id" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(12,4) NOT NULL,
    "iva" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "estado_pago" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "vencimiento" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reportes" (
    "id" SERIAL NOT NULL,
    "tipo_reporte" VARCHAR(50) NOT NULL,
    "fecha_generacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datos_resumidos" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "formato" VARCHAR(20) NOT NULL DEFAULT 'PDF',
    "venta_id" INTEGER,
    "factura_id" INTEGER,
    "inventory_id" TEXT,
    "production_lot_id" TEXT,
    "costeo_id" INTEGER,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."costeos" (
    "id" SERIAL NOT NULL,
    "production_lot_id" TEXT NOT NULL,
    "id_metodo" INTEGER NOT NULL,
    "costo_total" DECIMAL(12,4) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "costeos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."factores_de_costeo" (
    "id" SERIAL NOT NULL,
    "id_costeo" INTEGER NOT NULL,
    "valor" DECIMAL(12,4) NOT NULL,
    "cantidad" DECIMAL(12,4) NOT NULL,
    "unidad_medida" VARCHAR(50) NOT NULL,

    CONSTRAINT "factores_de_costeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."precios_productos" (
    "id" SERIAL NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "id_estrategia" INTEGER NOT NULL,
    "precio_base" DECIMAL(12,4) NOT NULL,
    "precio_final" DECIMAL(12,4) NOT NULL,
    "vigente_desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vigente_hasta" TIMESTAMP(3) NOT NULL,
    "costeo_id" INTEGER,

    CONSTRAINT "precios_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registros_produccion" (
    "id" SERIAL NOT NULL,
    "production_lot_id" TEXT NOT NULL,
    "id_tipo_registro" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costo_unitario" DECIMAL(12,4) NOT NULL,
    "costo_total" DECIMAL(12,4) NOT NULL,
    "nota" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_produccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personas_correo_key" ON "public"."personas"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_persona_key" ON "public"."usuarios"("id_persona");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "public"."usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_id_venta_key" ON "public"."facturas"("id_venta");

-- CreateIndex
CREATE UNIQUE INDEX "costeos_production_lot_id_version_key" ON "public"."costeos"("production_lot_id", "version");

-- AddForeignKey
ALTER TABLE "public"."personas" ADD CONSTRAINT "personas_tipo_entidad_catalogo_persona_fkey" FOREIGN KEY ("tipo_entidad_catalogo_persona") REFERENCES "public"."catalogo_personas_clientes_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personas" ADD CONSTRAINT "personas_tipo_persona_catalogo_persona_fkey" FOREIGN KEY ("tipo_persona_catalogo_persona") REFERENCES "public"."catalogo_personas_clientes_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_id_persona_fkey" FOREIGN KEY ("id_persona") REFERENCES "public"."personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ventas" ADD CONSTRAINT "ventas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "public"."personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ventas" ADD CONSTRAINT "ventas_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ventas" ADD CONSTRAINT "ventas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_ventas" ADD CONSTRAINT "detalle_ventas_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "public"."ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."detalle_ventas" ADD CONSTRAINT "detalle_ventas_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."facturas" ADD CONSTRAINT "facturas_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "public"."ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "public"."ventas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "public"."facturas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_production_lot_id_fkey" FOREIGN KEY ("production_lot_id") REFERENCES "public"."production_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reportes" ADD CONSTRAINT "reportes_costeo_id_fkey" FOREIGN KEY ("costeo_id") REFERENCES "public"."costeos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."costeos" ADD CONSTRAINT "costeos_production_lot_id_fkey" FOREIGN KEY ("production_lot_id") REFERENCES "public"."production_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."costeos" ADD CONSTRAINT "costeos_id_metodo_fkey" FOREIGN KEY ("id_metodo") REFERENCES "public"."catalogo_general_categorias_procedimientos_calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."factores_de_costeo" ADD CONSTRAINT "factores_de_costeo_id_costeo_fkey" FOREIGN KEY ("id_costeo") REFERENCES "public"."costeos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."precios_productos" ADD CONSTRAINT "precios_productos_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."precios_productos" ADD CONSTRAINT "precios_productos_id_estrategia_fkey" FOREIGN KEY ("id_estrategia") REFERENCES "public"."catalogo_general_categorias_procedimientos_calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."precios_productos" ADD CONSTRAINT "precios_productos_costeo_id_fkey" FOREIGN KEY ("costeo_id") REFERENCES "public"."costeos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_produccion" ADD CONSTRAINT "registros_produccion_production_lot_id_fkey" FOREIGN KEY ("production_lot_id") REFERENCES "public"."production_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registros_produccion" ADD CONSTRAINT "registros_produccion_id_tipo_registro_fkey" FOREIGN KEY ("id_tipo_registro") REFERENCES "public"."catalogo_general_categorias_procedimientos_calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
