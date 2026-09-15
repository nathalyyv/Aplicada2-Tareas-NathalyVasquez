-- CreateTable
CREATE TABLE "Inventario" (
    "id" SERIAL NOT NULL,
    "producto" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "stockMinimo" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);
