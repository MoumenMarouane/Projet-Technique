<div align="center">

```
╔═══════════════════════════════════════════════════════════╗
║          PLATEFORME DE GESTION COMMERCIALE                ║
║          NestJS · Prisma · PostgreSQL · React             ║
╚═══════════════════════════════════════════════════════════╝
```

**Une application full-stack complète pour gérer tout le cycle commercial**
*Produits · Variantes · Devis · Commandes · Factures · Paiements · Tickets de caisse*

---

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🗂️ Table des matières

- [À propos](#-à-propos)
- [Flux commerciaux](#-flux-commerciaux)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Schéma de la base de données](#-schéma-de-la-base-de-données)
- [Modèle Conceptuel de Données (MCD)](#-modèle-conceptuel-de-données-mcd)
- [Enums Prisma](#-enums-prisma)
- [API — Endpoints](#-api--endpoints)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Structure du projet](#-structure-du-projet)
- [Rôles & permissions](#-rôles--permissions)
- [État d'avancement](#-état-davancement)

---

## 🧭 À propos

Ce projet est une **plateforme web de gestion commerciale** pensée pour tout type de commerce (vêtements, chaussures, électronique, pièces détachées...).

La particularité principale : la gestion des **variantes de produits**. Un article peut exister en plusieurs combinaisons d'attributs (couleur, taille, capacité, numéro de série), chacune avec son propre stock. Un pantalon Noir/42 n'est pas interchangeable avec un Blanc/38 — la plateforme le sait.

Deux rôles, deux mondes :
- 🏪 **VENDEUR** — gère son catalogue, ses commandes, sa facturation, sa caisse
- 🛒 **CLIENT** — soumet des devis, suit ses commandes, paie ses factures

---

## 🔄 Flux commerciaux

```
FLUX CLIENT NORMAL
──────────────────
  CLIENT                    VENDEUR
    │                          │
    │── Crée un devis ────────►│
    │                          │── Accepte / Refuse
    │◄── Commande auto ────────│   (commande créée automatiquement si ACCEPTE)
    │                          │── Confirme ──► Facture générée (HT + TVA + TTC)
    │                          │── Traite
    │                          │── Livre
    │── Paie par carte ───────►│
    │                          │── Enregistre espèces/virement/chèque


FLUX VENTE EN CAISSE (ANONYME)
───────────────────────────────
  VENDEUR
    │
    │── Sélectionne produits + variantes
    │── Clique "Émettre le ticket"
    │
    ▼
  Client anonyme créé automatiquement
  Commande ANONYME créée
  Ticket de caisse généré ✓
  Stock décrémenté ✓
```

---

## ✨ Fonctionnalités

### 🏪 Côté Vendeur
- **Catalogue** — Création de produits avec photo (Supabase Storage), axes de variation, génération automatique de variantes par produit cartésien
- **Stocks** — Stock individuel par variante, décrémentation automatique à chaque commande
- **Devis** — Approbation/refus, création automatique de commande à l'acceptation
- **Commandes** — Suivi des statuts : `EN_COURS` → `LIVREE` | `ANNULEE`
- **Facturation** — Génération automatique à la confirmation de commande
- **Paiements** — Enregistrement espèces, virement, chèque, carte bancaire
- **Tickets de caisse** — Interface de caisse directe pour ventes anonymes
- **Dashboard** — CA réel, commandes, top produits, graphiques analytiques (Recharts)

### 🛒 Côté Client
- **Devis** — Sélection boutique + produits + variantes, soumission au vendeur
- **Commandes** — Suivi de l'avancement en temps réel
- **Factures** — Consultation de ses factures et historique de paiements

---

## 🛠️ Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| **Back-end** | NestJS + TypeScript | API REST, logique métier, auth JWT |
| **ORM** | Prisma 6 | Modélisation BDD, migrations, client typé |
| **Base de données** | PostgreSQL (Supabase) | Persistance relationnelle |
| **Stockage** | Supabase Storage | Images produits |
| **Front-end** | React 18 + TypeScript + Vite | Interface utilisateur |
| **Styles** | Tailwind CSS v4 | UI dark mode moderne |
| **État global** | Zustand | Auth store, rehydratation depuis JWT |
| **Graphiques** | Recharts | Dashboard analytique |
| **i18n** | react-i18next | Internationalisation FR / EN |
| **Auth** | JWT + bcrypt | Tokens signés, mots de passe hachés |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONT-END (React)                     │
│   Pages: Dashboard · Produits · Devis · Commandes       │
│          Factures · Tickets · Clients · Catégories       │
│   Store: Zustand (authStore — rehydratation JWT)         │
│   i18n: react-i18next (FR / EN)                         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST (axios)
┌──────────────────────▼──────────────────────────────────┐
│                   BACK-END (NestJS)                      │
│   Modules: auth · vendeurs · clients · categories       │
│            produits · variantes · devis · commandes     │
│            factures · tickets · dashboard               │
│   Guards: JwtAuthGuard · RolesGuard · @CurrentUser()    │
└──────────────────────┬──────────────────────────────────┘
                       │ Prisma Client
┌──────────────────────▼──────────────────────────────────┐
│              PostgreSQL (Supabase)                       │
│   Users · Vendeurs · Clients · Catégories               │
│   AttributTypes · AttributOptions                       │
│   Produits · Variantes · VarianteItems                  │
│   Devis · LignesDevis · Commandes · LignesCommande      │
│   Factures · Paiements · Tickets                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🗃️ Schéma de la base de données

### Schéma Prisma complet

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─── Enums ────────────────────────────────────────────────
enum Role {
  VENDEUR
  CLIENT
}

enum TypeClient {
  PARTICULIER
  PROFESSIONNEL
}

enum StatutDevis {
  EN_ATTENTE
  ACCEPTE
  REFUSE
  EXPIRE
}

enum StatutCommande {
  EN_COURS
  LIVREE
  ANNULEE
}

enum StatutPaiement {
  NON_PAYE
  PARTIEL
  SOLDE
}

enum MethodePaiement {
  ESPECES
  VIREMENT
  CHEQUE
  CARTE
}

enum TypeCommande {
  FACTURE
  TICKET
}

// ─── Utilisateurs ─────────────────────────────────────────
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  vendeur   Vendeur?
  client    Client?
}

model Vendeur {
  id         String      @id @default(uuid())
  nom        String
  prenom     String?
  telephone  String?
  userId     String      @unique
  user       User        @relation(fields: [userId], references: [id])
  adresses   Adresse[]
  contacts   Contact[]
  entreprise Entreprise?
  produits   Produit[]
  devis      Devis[]
  commandes  Commande[]
}

model Client {
  id         String     @id @default(uuid())
  nom        String
  prenom     String?
  email      String?
  telephone  String?
  typeClient TypeClient @default(PARTICULIER)
  anonyme    Boolean    @default(false)
  userId     String?    @unique
  user       User?      @relation(fields: [userId], references: [id])
  adresses   Adresse[]
  contacts   Contact[]
  entreprise Entreprise?
  devis      Devis[]
  commandes  Commande[]
}

// ─── Adresses & Contacts ──────────────────────────────────
model Adresse {
  id         String   @id @default(uuid())
  rue        String
  ville      String
  codePostal String?
  region     String?
  pays       String   @default("Maroc")
  vendeurId  String?
  clientId   String?
  vendeur    Vendeur? @relation(fields: [vendeurId], references: [id])
  client     Client?  @relation(fields: [clientId], references: [id])
}

model Contact {
  id        String   @id @default(uuid())
  nom       String
  prenom    String?
  email     String?
  telephone String?
  cin       String?
  vendeurId String?
  clientId  String?
  vendeur   Vendeur? @relation(fields: [vendeurId], references: [id])
  client    Client?  @relation(fields: [clientId], references: [id])
}

model Entreprise {
  id              String   @id @default(uuid())
  nom             String
  registreCommerce String?
  numeroImpot     String?
  vendeurId       String?  @unique
  clientId        String?  @unique
  vendeur         Vendeur? @relation(fields: [vendeurId], references: [id])
  client          Client?  @relation(fields: [clientId], references: [id])
}

// ─── Catalogue ────────────────────────────────────────────
model Categorie {
  id            String         @id @default(uuid())
  nom           String
  description   String?
  attributTypes AttributType[]
  produits      Produit[]
}

model AttributType {
  id           String           @id @default(uuid())
  nom          String
  estUnique    Boolean          @default(false)
  categorieId  String
  categorie    Categorie        @relation(fields: [categorieId], references: [id])
  options      AttributOption[]
}

model AttributOption {
  id             String        @id @default(uuid())
  valeur         String
  attributTypeId String
  attributType   AttributType  @relation(fields: [attributTypeId], references: [id])
  varianteItems  VarianteItem[]
}

model Produit {
  id          String     @id @default(uuid())
  nom         String
  description String?
  imageUrl    String?
  categorieId String
  vendeurId   String
  categorie   Categorie  @relation(fields: [categorieId], references: [id])
  vendeur     Vendeur    @relation(fields: [vendeurId], references: [id])
  variantes   Variante[]
}

model Variante {
  id         String         @id @default(uuid())
  stock      Int            @default(0)
  prixModif  Float?
  produitId  String
  produit    Produit        @relation(fields: [produitId], references: [id])
  items      VarianteItem[]
  lignesCmd  LigneCommande[]
  lignesDev  LigneDevis[]
}

model VarianteItem {
  id               String         @id @default(uuid())
  varianteId       String
  attributOptionId String
  variante         Variante       @relation(fields: [varianteId], references: [id])
  attributOption   AttributOption @relation(fields: [attributOptionId], references: [id])
}

// ─── Devis ────────────────────────────────────────────────
model Devis {
  id        String      @id @default(uuid())
  statut    StatutDevis @default(EN_ATTENTE)
  clientId  String
  vendeurId String
  client    Client      @relation(fields: [clientId], references: [id])
  vendeur   Vendeur     @relation(fields: [vendeurId], references: [id])
  lignes    LigneDevis[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

model LigneDevis {
  id           String   @id @default(uuid())
  quantite     Int
  prixUnitaire Float
  devisId      String
  varianteId   String
  devis        Devis    @relation(fields: [devisId], references: [id])
  variante     Variante @relation(fields: [varianteId], references: [id])
}

// ─── Commandes ────────────────────────────────────────────
model Commande {
  id           String         @id @default(uuid())
  statut       StatutCommande @default(EN_COURS)
  typeCommande TypeCommande   @default(FACTURE)
  clientId     String
  vendeurId    String
  client       Client         @relation(fields: [clientId], references: [id])
  vendeur      Vendeur        @relation(fields: [vendeurId], references: [id])
  lignes       LigneCommande[]
  facture      Facture?
  ticket       Ticket?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model LigneCommande {
  id           String   @id @default(uuid())
  quantite     Int
  prixUnitaire Float
  commandeId   String
  varianteId   String
  commande     Commande @relation(fields: [commandeId], references: [id])
  variante     Variante @relation(fields: [varianteId], references: [id])
}

// ─── Facturation ──────────────────────────────────────────
model Facture {
  id           String         @id @default(uuid())
  montantTotal Float
  statut       StatutPaiement @default(NON_PAYE)
  commandeId   String         @unique
  commande     Commande       @relation(fields: [commandeId], references: [id])
  paiements    Paiement[]
  createdAt    DateTime       @default(now())
}

model Paiement {
  id        String          @id @default(uuid())
  montant   Float
  methode   MethodePaiement
  factureId String
  facture   Facture         @relation(fields: [factureId], references: [id])
  createdAt DateTime        @default(now())
}

model Ticket {
  id         String   @id @default(uuid())
  commandeId String   @unique
  commande   Commande @relation(fields: [commandeId], references: [id])
  createdAt  DateTime @default(now())
}
```

---

## 🧩 Modèle Conceptuel de Données (MCD)

```
                    ┌───────────────────────────────────────────────────────┐
                    │                  CATEGORIE (globale)                  │
                    │               id · nom · description                  │
                    └────────────┬──────────────────────┬───────────────────┘
                                 │ 1,N                  │ 1,N
                                 │                      │
                    ┌────────────▼──────────┐  ┌────────▼──────────────────┐
                    │    ATTRIBUT_TYPE      │  │        PRODUIT            │
                    │  nom · estUnique      │  │  nom · description        │
                    └────────────┬──────────┘  │  prix_unitaire · image    │
                                 │ 1,N         │  FK id_vendeur            │
                    ┌────────────▼──────────┐  └────────┬──────────────────┘
                    │   ATTRIBUT_OPTION     │           │ 1,N
                    │       valeur          │  ┌────────▼──────────────────┐
                    └────────────┬──────────┘  │        VARIANTE           │
                                 │             │  stock · prix_modif       │
                                 └──────────── ► (via VARIANTE_ITEM)       │
                                               └────────┬──────────────────┘
                                                        │ 1,N
┌──────────┐  1,1   ┌──────────┐  1,N  ┌───────────────▼──────────────────┐
│   USER   ├───────►│ VENDEUR  ├──────►│          LIGNE_DEVIS             │
└────┬─────┘        └────┬─────┘       │  quantite · prix_unitaire_snap   │
     │                   │ 1,N         └───────────────┬──────────────────┘
   0,1│                  │                             │ N,1
     │            ┌──────▼──────────────────┐  ┌──────▼──────────────────┐
┌────▼─────┐      │         DEVIS           │  │                         │
│  CLIENT  │      │  date · statut          │  │         DEVIS           │
└────┬─────┘      │  FK id_client           │  │  (même entité)          │
     │ 1,N        │  FK id_vendeur          │  └─────────────────────────┘
     │            └──────┬──────────────────┘
     │                   │ si ACCEPTE
     │                   │ ▼ (auto)
     │            ┌──────▼──────────────────┐
     │            │       COMMANDE          │
     │            │  statut · type          │
     └───────────►│  FK id_client           │
          1,N     │  FK id_vendeur          │
                  └──────┬──────────────────┘
                         │
              ┌──────────┴──────────┐
              │ type=FACTURE        │ type=TICKET
              ▼                     ▼
         ┌─────────┐          ┌──────────┐
         │ FACTURE │          │  TICKET  │
         │ HT·TVA  │          │  montant │
         │   TTC   │          └──────────┘
         └────┬────┘
              │ 1,N
         ┌────▼────┐
         │PAIEMENT │
         │ methode │
         │ montant │
         └─────────┘

Règles métier :
- USER a exactement 1 rôle : VENDEUR ou CLIENT (jamais les deux)
- Les CATEGORIES sont globales — elles ne appartiennent à aucun vendeur
- DEVIS peut être créé par le CLIENT ou le VENDEUR
- Toute COMMANDE naît d'un DEVIS accepté (DEVIS → ACCEPTE = Commande auto)
- Exception unique : vente caisse (VENDEUR crée commande anonyme directe)
- Commande type=FACTURE → Facture générée automatiquement
- Commande type=TICKET  → Ticket généré + client anonyme créé si besoin
- Variante.stock décrémenté à chaque LigneCommande validée
- Si AttributType.estUnique = true → quantite forcée à 1
- StatutPaiement calculé : NON_PAYE / PARTIEL / SOLDE selon somme paiements
```
## 🗄️ Modèle Logique de Données (MLD)

```
USER(id_user, email, password_hash, role{VENDEUR|CLIENT})

VENDEUR(id_vendeur, nom, prenom, telephone, #id_user)
  id_user → USER

CLIENT(id_client, nom, prenom, email, telephone, type_client, anonyme,
       #id_user nullable)
  id_user → USER

ADRESSE(id_adresse, rue, ville, code_postal, region, pays,
        #id_vendeur nullable, #id_client nullable)

CONTACT(id_contact, nom, prenom, email, telephone, cin,
        #id_vendeur nullable, #id_client nullable)

ENTREPRISE(id_entreprise, nom, registre_commerce, numero_impot,
           #id_vendeur nullable unique, #id_client nullable unique)

CATEGORIE(id_categorie, nom, description)
  [Aucune FK vers VENDEUR — table globale]

ATTRIBUT_TYPE(id_attribut_type, nom, est_unique,
              #id_categorie)
  id_categorie → CATEGORIE

ATTRIBUT_OPTION(id_attribut_option, valeur,
                #id_attribut_type)
  id_attribut_type → ATTRIBUT_TYPE

PRODUIT(id_produit, nom, description, prix_unitaire, image_url,
        #id_categorie, #id_vendeur)
  id_categorie → CATEGORIE
  id_vendeur   → VENDEUR

VARIANTE(id_variante, stock, prix_modif nullable,
         #id_produit)
  id_produit → PRODUIT

VARIANTE_ITEM(#id_variante, #id_attribut_option)
  [Clé primaire composite]
  id_variante        → VARIANTE
  id_attribut_option → ATTRIBUT_OPTION

DEVIS(id_devis, date_devis, statut{EN_ATTENTE|ACCEPTE|REFUSE|EXPIRE},
      #id_client, #id_vendeur)
  id_client  → CLIENT
  id_vendeur → VENDEUR

LIGNE_DEVIS(id_ligne_devis, quantite, prix_unitaire_snapshot,
            #id_devis, #id_variante)
  id_devis    → DEVIS
  id_variante → VARIANTE

COMMANDE(id_commande, date_commande, statut{EN_COURS|LIVREE|ANNULEE},
         type{FACTURE|TICKET}, #id_client, #id_vendeur,
         #id_devis nullable unique)
  id_client  → CLIENT
  id_vendeur → VENDEUR
  id_devis   → DEVIS   [nullable — seulement NULL pour ventes caisse anonymes]

LIGNE_COMMANDE(id_ligne_commande, quantite, prix_unitaire_snapshot,
               #id_commande, #id_variante)
  id_commande → COMMANDE
  id_variante → VARIANTE

FACTURE(id_facture, montant_ht, tva, montant_ttc,
        statut_paiement{NON_PAYE|PARTIEL|SOLDE}, date_emission,
        #id_commande unique)
  id_commande → COMMANDE

PAIEMENT(id_paiement, montant, methode{ESPECES|VIREMENT|CHEQUE|CARTE},
         date_paiement, reference, #id_facture)
  id_facture → FACTURE

TICKET(id_ticket, montant_total, date_emission,
       #id_commande unique)
  id_commande → COMMANDE
```
---
## 👥 Diagramme de classes — Rôles & responsabilités

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              <<abstract>>                               │
│                                  USER                                   │
│                     email · passwordHash · role                         │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
role=VENDEUR  │                         │  role=CLIENT
              ▼                         ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│         VENDEUR         │   │         CLIENT          │
│  nom · prenom           │   │  type: PARTICULIER      │
│  telephone              │   │       | PROFESSIONNEL   │
├─────────────────────────┤   │  anonyme: boolean       │
│ + gérerCatalogue()      │   ├─────────────────────────┤
│ + créerProduit()        │   │ + créerDevis()          │
│ + gérerVariantes()      │   │ + consulterDevis()      │
│ + créerDevis()          │   │ + consulterCommandes()  │
│ + accepterDevis()       │   │ + consulterFactures()   │
│ + refuserDevis()        │   └─────────────────────────┘
│ + gérerCommandes()      │
│ + livrerCommande()      │   ┌─────────────────────────┐
│ + consulterFactures()   │   │     CLIENT ANONYME      │
│ + enregistrerPaiement() │   │  (pas de compte USER)   │
│ + émettreTicketCaisse() │   ├─────────────────────────┤
│ + consulterDashboard()  │   │ créé automatiquement    │
└─────────────────────────┘   │ lors d'une vente caisse │
                              └─────────────────────────┘

Règles :
- USER est soit VENDEUR soit CLIENT — jamais les deux
- CLIENT ANONYME n'a pas de compte : id_user = null
- Les deux rôles peuvent créer un DEVIS
- Seul le VENDEUR accepte/refuse un devis et émet des tickets
- Seul le VENDEUR accède au dashboard
- Toute commande naît d'un DEVIS accepté, sauf vente caisse anonyme
- Paiements : CLIENT (carte uniquement) · VENDEUR (tous modes)
```
## 🏷️ Enums Prisma

| Enum | Valeurs |
|------|---------|
| `Role` | `VENDEUR` · `CLIENT` |
| `TypeClient` | `PARTICULIER` · `PROFESSIONNEL` |
| `StatutDevis` | `EN_ATTENTE` · `ACCEPTE` · `REFUSE` · `EXPIRE` |
| `StatutCommande` | `EN_COURS` · `LIVREE` · `ANNULEE` |
| `StatutPaiement` | `NON_PAYE` · `PARTIEL` · `SOLDE` |
| `MethodePaiement` | `ESPECES` · `VIREMENT` · `CHEQUE` · `CARTE` |
| `TypeCommande` | `FACTURE` · `TICKET` |

---

## 🔌 API — Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/auth/register` | Inscription (VENDEUR ou CLIENT) |
| `POST` | `/auth/login` | Connexion → JWT |

### Catégories & Attributs
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/categories` | Liste toutes les catégories |
| `POST` | `/categories` | Créer une catégorie |
| `GET` | `/categories/:id` | Détail + attributTypes |
| `POST` | `/categories/:id/attributs` | Ajouter un AttributType |
| `POST` | `/attributs/:id/options` | Ajouter une AttributOption |

### Produits & Variantes
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/produits` | Liste produits du vendeur |
| `POST` | `/produits` | Créer un produit |
| `PATCH` | `/produits/:id` | Modifier un produit |
| `DELETE` | `/produits/:id` | Supprimer un produit |
| `GET` | `/produits/:id/variantes` | Variantes d'un produit |
| `POST` | `/produits/:id/variantes` | Créer une variante |
| `PATCH` | `/variantes/:id` | Modifier stock/prix d'une variante |

### Devis
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/devis` | Liste des devis |
| `POST` | `/devis` | Créer un devis |
| `PATCH` | `/devis/:id/statut` | Changer statut (ACCEPTE → crée commande auto) |

### Commandes
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/commandes` | Liste des commandes |
| `GET` | `/commandes/:id` | Détail commande + lignes |
| `POST` | `/commandes` | Créer commande directe (caisse) |
| `PATCH` | `/commandes/:id/statut` | Livrer / Annuler |

### Factures & Paiements
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/factures/:id` | Détail facture + paiements |
| `POST` | `/factures/:id/paiements` | Ajouter un paiement |

### Dashboard
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/dashboard/stats` | CA, commandes, top produits, CA/mois |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Un projet Supabase (PostgreSQL + Storage)

### Backend

```bash
cd backend
npm install

cp .env.example .env
# → remplir les variables

npx prisma generate
npx prisma migrate deploy

npm run start:dev
```

### Frontend

```bash
cd frontend
npm install

cp .env.example .env
# → VITE_API_URL=http://localhost:3000

npm run dev
```

---

## 🔐 Variables d'environnement

### Backend — `.env`

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="votre_secret_jwt"
JWT_EXPIRES_IN="7d"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_KEY="eyJ..."
SUPABASE_BUCKET="produits-images"
PORT=3000
```

### Frontend — `.env`

```env
VITE_API_URL="http://localhost:3000"
```

---

## 📁 Structure du projet

```
projet/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT, bcrypt, register/login
│   │   ├── vendeurs/          # Profil vendeur
│   │   ├── clients/           # Clients normaux + anonymes
│   │   ├── categories/        # Catégories + AttributTypes + Options
│   │   ├── produits/          # Catalogue + variantes + images
│   │   ├── devis/             # Cycle devis + auto-commande
│   │   ├── commandes/         # Cycle commande + décrémentation stock
│   │   ├── factures/          # Facturation + paiements
│   │   ├── tickets/           # Tickets de caisse
│   │   ├── dashboard/         # Stats agrégées
│   │   ├── common/            # Guards, décorateurs
│   │   └── prisma/            # PrismaService
│   └── prisma/
│       └── schema.prisma
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── auth/          # Login, Register
        │   ├── dashboard/     # Dashboard (général + analyses)
        │   ├── clients/       # Clients (liste + recherche)
        │   ├── produits/      # Produits + ProduitForm (2 étapes: axes → variantes)
        │   ├── commandes/     # Commandes + CommandeDetail
        │   ├── devis/         # Devis + DevisForm
        │   ├── factures/      # Factures + PaiementForm
        │   └── categories/    # Catégories + CRUD AttributTypes
        ├── services/          # api.ts + services métier (axios)
        ├── store/
        │   └── authStore.ts   # Zustand + rehydratation JWT
        ├── types/
        │   └── index.ts       # Tous les types TypeScript
        ├── i18n/
        │   └── index.ts       # Config i18next
        ├── locales/
        │   ├── fr/translation.json
        │   └── en/translation.json
        └── components/
            └── layout/        # Layout, Sidebar, TopBar, ProtectedRoute
```

---

## 🔒 Rôles & permissions

| Action | CLIENT | VENDEUR |
|--------|:------:|:-------:|
| Créer un devis | ✅ | ❌ |
| Accepter / refuser un devis | ❌ | ✅ |
| Confirmer / livrer une commande | ❌ | ✅ |
| Émettre un ticket de caisse | ❌ | ✅ |
| Consulter ses factures | ✅ | ✅ |
| Enregistrer espèces / virement / chèque | ❌ | ✅ |
| Accéder au dashboard | ❌ | ✅ |
| Gérer le catalogue produits | ❌ | ✅ |
| Gérer les catégories & attributs | ❌ | ✅ |

---

## 🧩 Système de variantes — détail

Le cœur du système : chaque produit appartient à une catégorie qui définit des **axes de variation** (AttributType). Chaque axe a des **valeurs possibles** (AttributOption). Chaque combinaison unique forme une **Variante** avec son propre stock.

```
Categorie "Chaussures"
  └── AttributType "Couleur"
        ├── AttributOption "Blanc"
        └── AttributOption "Noir"
  └── AttributType "Taille"
        ├── AttributOption "38"
        ├── AttributOption "39"
        └── AttributOption "41"

Produit "Nike Air Force"
  └── Variante: Blanc/38  → stock: 10
  └── Variante: Blanc/39  → stock: 5   ← c'est cette variante qui est commandée
  └── Variante: Noir/38   → stock: 0   ← rupture
  └── Variante: Noir/39   → stock: 3
```

### Workflow création produit (frontend — 2 étapes)

```
Étape 1 — Définir les axes
  ┌─────────────────────────────┐
  │ Nom du produit              │
  │ Catégorie                   │
  │ Prix de base                │
  │ ─────────────────────────── │
  │ Axes de variation :         │
  │  [Couleur] Rouge / Bleu     │
  │  [Taille]  39 / 41          │
  │            [+ Ajouter axe]  │
  └─────────────────────────────┘
            ▼ Générer
Étape 2 — Définir stock par variante (produit cartésien)
  ┌──────────────────────────────────────┐
  │ Rouge / 39  │ stock: [__]  prix: [__]│
  │ Rouge / 41  │ stock: [__]  prix: [__]│
  │ Bleu  / 39  │ stock: [__]  prix: [__]│
  │ Bleu  / 41  │ stock: [__]  prix: [__]│
  └──────────────────────────────────────┘
```

### Flag `estUnique` (numéros de série)

Quand `AttributType.estUnique = true`, chaque option représente une unité physique unique (ex: N° série). La quantité sur la LigneCommande est forcée à **1** et l'option est marquée comme utilisée.

---

## ✅ État d'avancement

### Backend
- [x] Auth (register / login / JWT)
- [x] Module Vendeurs
- [x] Module Clients (+ anonymes)
- [x] Module Catégories + AttributTypes + AttributOptions
- [x] Module Produits + Variantes
- [x] Module Devis
- [x] Module Commandes (décrémentation stock variante)
- [x] Module Factures + Paiements
- [x] Module Tickets
- [x] Dashboard stats
- [ ] Auto-création commande quand devis → ACCEPTE *(en cours)*
- [ ] Upload image produit (Supabase Storage) *(en cours)*

### Frontend
- [x] Auth (Login / Register)
- [x] Layout (Sidebar, TopBar, ProtectedRoute)
- [x] Dashboard (vue générale + analyses)
- [x] Page Clients
- [x] Page Produits + ProduitForm (2 étapes variantes)
- [x] Page Commandes + CommandeDetail
- [x] Page Devis + DevisForm
- [x] Page Factures + PaiementForm
- [x] Types TypeScript globaux (`src/types/index.ts`)
- [x] i18n FR / EN (react-i18next)
- [ ] Page Catégories complète (CRUD + AttributTypes) *(en cours)*
- [ ] Toggle langue dans TopBar *(en cours)*

---

<div align="center">

*Projet réalisé dans le cadre d'un stage technique — Licence Pro Informatique*
*École Supérieure de Technologie de Fès — 2025-2026*

**Marouane MOUMEN**

</div>