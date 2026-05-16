// ─── Enums ────────────────────────────────────────────────────────────────────
export type Role = 'VENDEUR' | 'CLIENT';
export type TypeClient = 'LEGAL' | 'ANONYME';
export type StatutDevis = 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'EXPIRE';
export type StatutCommande = 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_COURS' | 'LIVREE' | 'ANNULEE';
export type StatutPaiement = 'NON_PAYE' | 'PARTIEL' | 'SOLDE';
export type MethodePaiement = 'ESPECES' | 'VIREMENT' | 'CHEQUE' | 'ONLINE';
export type TypeCommande = 'NORMAL' | 'ANONYME';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  role: Role;
}

// ─── Catalogue – nouveau système ──────────────────────────────────────────────

export interface AttributType {
  id: string;
  nom: string;           // "Couleur", "Taille", "N° série"
  estUnique: boolean;    // true → stock forcé à 1 (ex: N° série)
  categorieId: string;
  options?: AttributOption[];
}

export interface AttributOption {
  id: string;
  valeur: string;        // "Rouge", "39", "SN-ABC123"
  attributTypeId: string;
  attributType?: AttributType;
}

export interface VarianteItem {
  varianteId: string;
  attributOptionId: string;
  attributOption?: AttributOption;
}

export interface Variante {
  id: string;
  produitId: string;
  stock: number;
  prixModif?: number;    // surcharge optionnelle du prix de base
  items?: VarianteItem[];
}

// ─── Catégorie ────────────────────────────────────────────────────────────────
export interface Categorie {
  id: string;
  libelle: string;
  description?: string;
  imageUrl?: string;     // photo illustrant la catégorie
  attributTypes?: AttributType[];
}

// ─── Produit ──────────────────────────────────────────────────────────────────
export interface Produit {
  id: string;
  nom: string;
  description?: string;
  prixUnitaire: number;
  imageUrl?: string;     // photo principale du produit
  categorieId: string;
  categorie?: Categorie;
  variantes?: Variante[];
}

// ─── Client & Vendeur ─────────────────────────────────────────────────────────
export interface Client {
  id: string;
  type: TypeClient;
  userId?: string;
  statut?: string;
}

export interface Vendeur {
  id: string;
  boutiqueNom: string;
  boutiqueDesc?: string;
  userId: string;
}

// ─── Devis ────────────────────────────────────────────────────────────────────
export interface LigneDevis {
  id: string;
  devisId: string;
  varianteId?: string;
  variante?: Variante;
  quantite: number;
  prixUnitaireSnap: number;
}

export interface Devis {
  id: string;
  statut: StatutDevis;
  clientId: string;
  client?: Client;
  vendeurId: string;
  vendeur?: Vendeur;
  lignes?: LigneDevis[];
  dateDevis: string;
}

// ─── Commandes ────────────────────────────────────────────────────────────────
export interface LigneCommande {
  id: string;
  commandeId: string;
  varianteId?: string;
  variante?: Variante;
  quantite: number;
  prixUnitaireSnap: number;
}

export interface Commande {
  id: string;
  statut: StatutCommande;
  type: TypeCommande;
  clientId: string;
  client?: Client;
  vendeurId: string;
  vendeur?: Vendeur;
  lignes?: LigneCommande[];
  facture?: Facture;
  ticket?: Ticket;
  dateCommande: string;
}

// ─── Factures & Tickets ───────────────────────────────────────────────────────
export interface Paiement {
  id: string;
  montantVerse: number;
  methode: MethodePaiement;
  factureId: string;
  datePaiement: string;
  reference?: string;
}

export interface Facture {
  id: string;
  statutPaiement: StatutPaiement;
  commandeId: string;
  commande?: Commande;
  paiements?: Paiement[];
  montantHt: number;
  tva: number;
  montantTtc: number;
  dateEmission: string;
}

export interface Ticket {
  id: string;
  commandeId: string;
  montantTotal: number;
  dateEmission: string;
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