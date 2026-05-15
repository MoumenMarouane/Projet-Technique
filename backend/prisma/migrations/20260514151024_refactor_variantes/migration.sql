-- AlterTable
ALTER TABLE "lignes_commande" ADD COLUMN     "id_variante" TEXT;

-- AlterTable
ALTER TABLE "lignes_devis" ADD COLUMN     "id_variante" TEXT;

-- CreateTable
CREATE TABLE "attribut_types" (
    "id" TEXT NOT NULL,
    "id_categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "est_unique" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attribut_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribut_options" (
    "id" TEXT NOT NULL,
    "id_attribut_type" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,

    CONSTRAINT "attribut_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variantes" (
    "id" TEXT NOT NULL,
    "id_produit" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "prix_modif" DECIMAL(10,2),

    CONSTRAINT "variantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variante_items" (
    "id_variante" TEXT NOT NULL,
    "id_attribut_option" TEXT NOT NULL,

    CONSTRAINT "variante_items_pkey" PRIMARY KEY ("id_variante","id_attribut_option")
);

-- AddForeignKey
ALTER TABLE "attribut_types" ADD CONSTRAINT "attribut_types_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribut_options" ADD CONSTRAINT "attribut_options_id_attribut_type_fkey" FOREIGN KEY ("id_attribut_type") REFERENCES "attribut_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variantes" ADD CONSTRAINT "variantes_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variante_items" ADD CONSTRAINT "variante_items_id_variante_fkey" FOREIGN KEY ("id_variante") REFERENCES "variantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variante_items" ADD CONSTRAINT "variante_items_id_attribut_option_fkey" FOREIGN KEY ("id_attribut_option") REFERENCES "attribut_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_devis" ADD CONSTRAINT "lignes_devis_id_variante_fkey" FOREIGN KEY ("id_variante") REFERENCES "variantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_id_variante_fkey" FOREIGN KEY ("id_variante") REFERENCES "variantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
