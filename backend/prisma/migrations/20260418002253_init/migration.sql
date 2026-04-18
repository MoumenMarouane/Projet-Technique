-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VENDEUR', 'CLIENT');

-- CreateEnum
CREATE TYPE "TypeClient" AS ENUM ('LEGAL', 'ANONYME');

-- CreateEnum
CREATE TYPE "StatutDevis" AS ENUM ('BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'EXPIRE');

-- CreateEnum
CREATE TYPE "TypeCommande" AS ENUM ('NORMAL', 'ANONYME');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'LIVREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('NON_PAYE', 'PARTIEL', 'SOLDE');

-- CreateEnum
CREATE TYPE "MethodePaiement" AS ENUM ('ESPECES', 'CHEQUE', 'ONLINE', 'VIREMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendeurs" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "boutique_nom" TEXT NOT NULL,
    "boutique_desc" TEXT,

    CONSTRAINT "vendeurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "id_user" TEXT,
    "type" "TypeClient" NOT NULL,
    "date_inscription" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adresses" (
    "id" TEXT NOT NULL,
    "rue" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "code_postal" TEXT NOT NULL,
    "region" TEXT,
    "pays" TEXT NOT NULL,
    "id_vendeur" TEXT,
    "id_client" TEXT,

    CONSTRAINT "adresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "email_contact" TEXT,
    "cin_passeport" TEXT,
    "id_vendeur" TEXT,
    "id_client" TEXT,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entreprises" (
    "id" TEXT NOT NULL,
    "raison_sociale" TEXT NOT NULL,
    "ice" TEXT,
    "if_fiscal" TEXT,
    "rc" TEXT,
    "cnss" TEXT,
    "patente" TEXT,
    "id_vendeur" TEXT,
    "id_client" TEXT,

    CONSTRAINT "entreprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carac_types" (
    "id" TEXT NOT NULL,
    "id_categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "carac_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produits" (
    "id" TEXT NOT NULL,
    "id_vendeur" TEXT NOT NULL,
    "id_categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "produits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carac_valeurs" (
    "id_produit" TEXT NOT NULL,
    "id_carac_type" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,

    CONSTRAINT "carac_valeurs_pkey" PRIMARY KEY ("id_produit","id_carac_type")
);

-- CreateTable
CREATE TABLE "devis" (
    "id" TEXT NOT NULL,
    "id_client" TEXT NOT NULL,
    "id_vendeur" TEXT NOT NULL,
    "date_devis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutDevis" NOT NULL DEFAULT 'BROUILLON',

    CONSTRAINT "devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_devis" (
    "id_devis" TEXT NOT NULL,
    "id_produit" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire_snapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "lignes_devis_pkey" PRIMARY KEY ("id_devis","id_produit")
);

-- CreateTable
CREATE TABLE "commandes" (
    "id" TEXT NOT NULL,
    "id_client" TEXT NOT NULL,
    "id_vendeur" TEXT NOT NULL,
    "type" "TypeCommande" NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_commande" (
    "id_commande" TEXT NOT NULL,
    "id_produit" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire_snapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "lignes_commande_pkey" PRIMARY KEY ("id_commande","id_produit")
);

-- CreateTable
CREATE TABLE "factures" (
    "id" TEXT NOT NULL,
    "id_commande" TEXT NOT NULL,
    "date_emission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant_ht" DECIMAL(10,2) NOT NULL,
    "tva" DECIMAL(5,2) NOT NULL,
    "montant_ttc" DECIMAL(10,2) NOT NULL,
    "statut_paiement" "StatutPaiement" NOT NULL DEFAULT 'NON_PAYE',

    CONSTRAINT "factures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "id_commande" TEXT NOT NULL,
    "date_emission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" TEXT NOT NULL,
    "id_facture" TEXT NOT NULL,
    "methode" "MethodePaiement" NOT NULL,
    "montant_verse" DECIMAL(10,2) NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendeurs_id_user_key" ON "vendeurs"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_user_key" ON "clients"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_ice_key" ON "entreprises"("ice");

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_id_vendeur_key" ON "entreprises"("id_vendeur");

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_id_client_key" ON "entreprises"("id_client");

-- CreateIndex
CREATE UNIQUE INDEX "factures_id_commande_key" ON "factures"("id_commande");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_id_commande_key" ON "tickets"("id_commande");

-- AddForeignKey
ALTER TABLE "vendeurs" ADD CONSTRAINT "vendeurs_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adresses" ADD CONSTRAINT "adresses_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "vendeurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adresses" ADD CONSTRAINT "adresses_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "vendeurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entreprises" ADD CONSTRAINT "entreprises_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "vendeurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entreprises" ADD CONSTRAINT "entreprises_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carac_types" ADD CONSTRAINT "carac_types_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produits" ADD CONSTRAINT "produits_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "vendeurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produits" ADD CONSTRAINT "produits_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carac_valeurs" ADD CONSTRAINT "carac_valeurs_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carac_valeurs" ADD CONSTRAINT "carac_valeurs_id_carac_type_fkey" FOREIGN KEY ("id_carac_type") REFERENCES "carac_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devis" ADD CONSTRAINT "devis_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devis" ADD CONSTRAINT "devis_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "vendeurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_devis" ADD CONSTRAINT "lignes_devis_id_devis_fkey" FOREIGN KEY ("id_devis") REFERENCES "devis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_devis" ADD CONSTRAINT "lignes_devis_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "vendeurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_id_facture_fkey" FOREIGN KEY ("id_facture") REFERENCES "factures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
