-- CreateTable
CREATE TABLE "public"."materials" (
    "id" TEXT NOT NULL,
    "precioCompra" DECIMAL(10,2) NOT NULL,
    "proveedor" TEXT,
    "inventario_id" TEXT NOT NULL,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_materials" (
    "product_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "cantidad" DECIMAL(12,4) NOT NULL,
    "unidadMedida" VARCHAR(50),

    CONSTRAINT "product_materials_pkey" PRIMARY KEY ("product_id","material_id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "categoria" TEXT,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "materials_inventario_id_idx" ON "public"."materials"("inventario_id");

-- CreateIndex
CREATE INDEX "products_categoria_idx" ON "public"."products"("categoria");

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "materials_inventario_id_fkey" FOREIGN KEY ("inventario_id") REFERENCES "public"."inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_materials" ADD CONSTRAINT "product_materials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_materials" ADD CONSTRAINT "product_materials_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
