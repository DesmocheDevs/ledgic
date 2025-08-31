-- AlterTable
ALTER TABLE "public"."materials" ADD COLUMN     "cantidadActual" DECIMAL(10,2),
ADD COLUMN     "costoPromedioPonderado" DECIMAL(10,2),
ADD COLUMN     "valorTotalInventario" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "public"."registro_produccion" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "costoUnitario" DECIMAL(10,2) NOT NULL,
    "costoTotal" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_produccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "registro_produccion_fecha_idx" ON "public"."registro_produccion"("fecha");

-- CreateIndex
CREATE INDEX "registro_produccion_lote_id_idx" ON "public"."registro_produccion"("lote_id");

-- CreateIndex
CREATE INDEX "registro_produccion_material_id_idx" ON "public"."registro_produccion"("material_id");

-- AddForeignKey
ALTER TABLE "public"."registro_produccion" ADD CONSTRAINT "registro_produccion_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
