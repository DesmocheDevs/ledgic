-- CreateEnum
CREATE TYPE "public"."Sexo" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."EstadoInventario" AS ENUM ('ACTIVO', 'INACTIVO', 'DESCONTINUADO');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "estado" "public"."EstadoInventario" NOT NULL,
    "unidad_medida" VARCHAR(50) NOT NULL,
    "proveedor" TEXT,
    "tipo" TEXT,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cedula_key" ON "public"."clients"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "clients_correo_key" ON "public"."clients"("correo");

-- CreateIndex
CREATE INDEX "clients_cedula_idx" ON "public"."clients"("cedula");

-- CreateIndex
CREATE INDEX "clients_correo_idx" ON "public"."clients"("correo");

-- CreateIndex
CREATE INDEX "inventory_categoria_idx" ON "public"."inventory"("categoria");

-- CreateIndex
CREATE INDEX "inventory_estado_idx" ON "public"."inventory"("estado");
