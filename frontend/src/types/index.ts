// ─── Enums ────────────────────────────────────────────────────────────────────
export type Role = 'VENDEUR' | 'CLIENT';
export type TypeClient = 'PARTICULIER' | 'PROFESSIONNEL';
export type StatutDevis = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE' | 'EXPIRE';
export type StatutCommande = 'EN_COURS' | 'LIVREE' | 'ANNULEE';
export type StatutPaiement = 'NON_PAYE' | 'PARTIEL' | 'SOLDE';
export type MethodePaiement = 'ESPECES' | 'VIREMENT' | 'CHEQUE' | 'CARTE';
export type TypeCommande = 'FACTURE' | 'TICKET';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  role: Role;
}

// ─── Entités de base ──────────────────────────────────────────────────────────
export interface Categorie {
  id: string;
  nom: string;
  description?: string;
  caracTypes?: CaracType[];
}

export interface CaracType {
  id: string;
  nom: string;
  categorieId: string;
}

export interface Produit {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  categorieId: string;
  categorie?: Categorie;
  caracValeurs?: CaracValeur[];
}

export interface CaracValeur {
  id: string;
  valeur: string;
  produitId: string;
  caracTypeId: string;
  caracType?: CaracType;
}

export interface Client {
  id: string;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  typeClient: TypeClient;
  userId?: string;
}

export interface Vendeur {
  id: string;
  nom: string;
  prenom?: string;
  email?: string;
  userId: string;
}

// ─── Devis ────────────────────────────────────────────────────────────────────
export interface LigneDevis {
  id: string;
  produitId: string;
  produit?: Produit;
  quantite: number;
  prixUnitaire: number;
}

export interface Devis {
  id: string;
  statut: StatutDevis;
  clientId: string;
  client?: Client;
  vendeurId: string;
  vendeur?: Vendeur;
  lignes?: LigneDevis[];
  total?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Commandes ────────────────────────────────────────────────────────────────
export interface LigneCommande {
  id: string;
  produitId: string;
  produit?: Produit;
  quantite: number;
  prixUnitaire: number;
}

export interface Commande {
  id: string;
  statut: StatutCommande;
  typeCommande: TypeCommande;
  clientId: string;
  client?: Client;
  vendeurId: string;
  vendeur?: Vendeur;
  lignes?: LigneCommande[];
  facture?: Facture;
  ticket?: Ticket;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Factures & Tickets ───────────────────────────────────────────────────────
export interface Paiement {
  id: string;
  montant: number;
  methode: MethodePaiement;
  factureId: string;
  createdAt: string;
}

export interface Facture {
  id: string;
  statut: StatutPaiement;
  commandeId: string;
  commande?: Commande;
  paiements?: Paiement[];
  montantTotal: number;
  montantPaye?: number;
  createdAt: string;
}

export interface Ticket {
  id: string;
  commandeId: string;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalCommandes: number;
  totalCA: number;
  commandesEnCours: number;
  devisEnAttente: number;
  topProduits?: { produit: string; quantite: number }[];
  caParMois?: { mois: string; ca: number }[];
}