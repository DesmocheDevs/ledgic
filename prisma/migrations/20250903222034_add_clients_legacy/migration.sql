-- CreateEnum
CREATE TYPE "public"."Sexo" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "numero" TEXT,
    "correo" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "sexo" "public"."Sexo" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_correo_key" ON "public"."clients"("correo");

-- CreateIndex
CREATE INDEX "clients_cedula_idx" ON "public"."clients"("cedula");
