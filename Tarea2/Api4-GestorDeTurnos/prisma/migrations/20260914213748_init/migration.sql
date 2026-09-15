-- CreateTable
CREATE TABLE "Turno" (
    "id" SERIAL NOT NULL,
    "cliente" TEXT NOT NULL,
    "servicio" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'esperando',

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);
