/*
  Warnings:

  - You are about to drop the column `actualizado` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `creado` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `proveedor` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_medida` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `product_materials` table. All the data in the column will be lost.
  - You are about to drop the column `unidadMedida` on the `product_materials` table. All the data in the column will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registro_produccion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[company_id,name]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_type` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_of_measure` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `product_materials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CompanyType" AS ENUM ('ORGANIZATION', 'SUPPLIER', 'BOTH');

-- CreateEnum
CREATE TYPE "public"."PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."InventoryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OBSOLETE');

-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('PRODUCT', 'MATERIAL');

-- CreateEnum
CREATE TYPE "public"."ProductionLotStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INIT', 'PURCHASE', 'PRODUCTION_IN', 'CONSUMPTION', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "public"."materials" DROP CONSTRAINT "materials_inventario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_materials" DROP CONSTRAINT "product_materials_material_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_materials" DROP CONSTRAINT "product_materials_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."registro_produccion" DROP CONSTRAINT "registro_produccion_material_id_fkey";

-- DropIndex
DROP INDEX "public"."inventory_categoria_idx";

-- DropIndex
DROP INDEX "public"."inventory_estado_idx";

-- AlterTable
ALTER TABLE "public"."inventory" DROP COLUMN "actualizado",
DROP COLUMN "categoria",
DROP COLUMN "creado",
DROP COLUMN "estado",
DROP COLUMN "nombre",
DROP COLUMN "proveedor",
DROP COLUMN "tipo",
DROP COLUMN "unidad_medida",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_quantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
ADD COLUMN     "item_type" "public"."ItemType" NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" "public"."InventoryStatus" NOT NULL,
ADD COLUMN     "total_inventory_value" DECIMAL(12,4) DEFAULT 0,
ADD COLUMN     "unit_of_measure" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weighted_average_cost" DECIMAL(12,4) DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."product_materials" DROP COLUMN "cantidad",
DROP COLUMN "unidadMedida",
ADD COLUMN     "quantity" DECIMAL(12,4) NOT NULL,
ADD COLUMN     "unit_of_measure" VARCHAR(50);

-- DropTable
DROP TABLE "public"."clients";

-- DropTable
DROP TABLE "public"."materials";

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."registro_produccion";

-- DropEnum
DROP TYPE "public"."EstadoInventario";

-- DropEnum
DROP TYPE "public"."Sexo";

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "contact" TEXT,
    "email" TEXT,
    "type" "public"."CompanyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchases" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "invoice_number" TEXT,
    "total_amount" DECIMAL(12,4) NOT NULL,
    "status" "public"."PurchaseStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchase_items" (
    "id" TEXT NOT NULL,
    "purchase_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "quantity" DECIMAL(12,4) NOT NULL,
    "unit_price" DECIMAL(12,4) NOT NULL,
    "item_total" DECIMAL(12,4) NOT NULL,

    CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_details" (
    "inventory_id" TEXT NOT NULL,
    "description" TEXT,
    "sale_price" DECIMAL(12,4),
    "production_cost" DECIMAL(12,4),
    "status" TEXT,

    CONSTRAINT "product_details_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "public"."material_details" (
    "inventory_id" TEXT NOT NULL,
    "supplier_company_id" TEXT,
    "unit_price" DECIMAL(12,4),

    CONSTRAINT "material_details_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "public"."production_lots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "lot_code" TEXT NOT NULL,
    "planned_quantity" DECIMAL(12,4) NOT NULL,
    "produced_quantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "unit_cost" DECIMAL(12,4),
    "total_cost" DECIMAL(12,4),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "public"."ProductionLotStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lot_material_consumptions" (
    "id" TEXT NOT NULL,
    "production_lot_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "quantity" DECIMAL(12,4) NOT NULL,
    "unit_cost" DECIMAL(12,4) NOT NULL,
    "total_cost" DECIMAL(12,4) NOT NULL,

    CONSTRAINT "lot_material_consumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_transactions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "purchase_id" TEXT,
    "production_lot_id" TEXT,
    "type" "public"."TransactionType" NOT NULL,
    "quantity" DECIMAL(12,4) NOT NULL,
    "unit_cost" DECIMAL(12,4) NOT NULL,
    "total_cost" DECIMAL(12,4) NOT NULL,
    "reference_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "public"."companies"("email");

-- CreateIndex
CREATE INDEX "purchases_company_id_idx" ON "public"."purchases"("company_id");

-- CreateIndex
CREATE INDEX "purchases_supplier_id_idx" ON "public"."purchases"("supplier_id");

-- CreateIndex
CREATE INDEX "purchases_invoice_number_idx" ON "public"."purchases"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_supplier_id_invoice_number_key" ON "public"."purchases"("supplier_id", "invoice_number");

-- CreateIndex
CREATE INDEX "purchase_items_purchase_id_idx" ON "public"."purchase_items"("purchase_id");

-- CreateIndex
CREATE INDEX "purchase_items_material_id_idx" ON "public"."purchase_items"("material_id");

-- CreateIndex
CREATE INDEX "material_details_supplier_company_id_idx" ON "public"."material_details"("supplier_company_id");

-- CreateIndex
CREATE INDEX "production_lots_company_id_idx" ON "public"."production_lots"("company_id");

-- CreateIndex
CREATE INDEX "production_lots_product_id_idx" ON "public"."production_lots"("product_id");

-- CreateIndex
CREATE INDEX "production_lots_lot_code_idx" ON "public"."production_lots"("lot_code");

-- CreateIndex
CREATE INDEX "production_lots_status_idx" ON "public"."production_lots"("status");

-- CreateIndex
CREATE UNIQUE INDEX "production_lots_company_id_product_id_lot_code_key" ON "public"."production_lots"("company_id", "product_id", "lot_code");

-- CreateIndex
CREATE INDEX "lot_material_consumptions_production_lot_id_idx" ON "public"."lot_material_consumptions"("production_lot_id");

-- CreateIndex
CREATE INDEX "lot_material_consumptions_material_id_idx" ON "public"."lot_material_consumptions"("material_id");

-- CreateIndex
CREATE UNIQUE INDEX "lot_material_consumptions_production_lot_id_material_id_key" ON "public"."lot_material_consumptions"("production_lot_id", "material_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_company_id_idx" ON "public"."inventory_transactions"("company_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_inventory_id_idx" ON "public"."inventory_transactions"("inventory_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_purchase_id_idx" ON "public"."inventory_transactions"("purchase_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_production_lot_id_idx" ON "public"."inventory_transactions"("production_lot_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_type_idx" ON "public"."inventory_transactions"("type");

-- CreateIndex
CREATE INDEX "inventory_transactions_reference_id_idx" ON "public"."inventory_transactions"("reference_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_created_at_idx" ON "public"."inventory_transactions"("created_at");

-- CreateIndex
CREATE INDEX "inventory_transactions_company_id_created_at_idx" ON "public"."inventory_transactions"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "inventory_transactions_inventory_id_created_at_idx" ON "public"."inventory_transactions"("inventory_id", "created_at");

-- CreateIndex
CREATE INDEX "inventory_company_id_idx" ON "public"."inventory"("company_id");

-- CreateIndex
CREATE INDEX "inventory_category_idx" ON "public"."inventory"("category");

-- CreateIndex
CREATE INDEX "inventory_status_idx" ON "public"."inventory"("status");

-- CreateIndex
CREATE INDEX "inventory_item_type_idx" ON "public"."inventory"("item_type");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_company_id_name_key" ON "public"."inventory"("company_id", "name");

-- AddForeignKey
ALTER TABLE "public"."purchases" ADD CONSTRAINT "purchases_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchases" ADD CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_items" ADD CONSTRAINT "purchase_items_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_details" ADD CONSTRAINT "product_details_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."material_details" ADD CONSTRAINT "material_details_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."material_details" ADD CONSTRAINT "material_details_supplier_company_id_fkey" FOREIGN KEY ("supplier_company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_materials" ADD CONSTRAINT "product_materials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_materials" ADD CONSTRAINT "product_materials_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_lots" ADD CONSTRAINT "production_lots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_lots" ADD CONSTRAINT "production_lots_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lot_material_consumptions" ADD CONSTRAINT "lot_material_consumptions_production_lot_id_fkey" FOREIGN KEY ("production_lot_id") REFERENCES "public"."production_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lot_material_consumptions" ADD CONSTRAINT "lot_material_consumptions_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_transactions" ADD CONSTRAINT "inventory_transactions_production_lot_id_fkey" FOREIGN KEY ("production_lot_id") REFERENCES "public"."production_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
