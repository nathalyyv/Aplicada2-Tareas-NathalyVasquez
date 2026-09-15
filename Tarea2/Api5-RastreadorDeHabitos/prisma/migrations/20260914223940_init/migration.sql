-- CreateTable
CREATE TABLE "Habito" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "registros" JSONB NOT NULL,

    CONSTRAINT "Habito_pkey" PRIMARY KEY ("id")
);
