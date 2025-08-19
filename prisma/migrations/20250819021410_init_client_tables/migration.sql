-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "numero" TEXT,
    "correo" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_cedula_key" ON "Client"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Client_correo_key" ON "Client"("correo");
