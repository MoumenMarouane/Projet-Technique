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
┌──────────┐       ┌──────────┐       ┌───────────────┐
│   USER   │──1,1──│ VENDEUR  │──1,N──│   CATEGORIE   │
└──────────┘       └──────────┘       └───────┬───────┘
     │                  │                     │ 1,N
   0,1│               1,N│                    │
     │                  │             ┌───────▼───────┐
┌────▼─────┐       ┌────▼─────┐      │ ATTRIBUTTYPE  │
│  CLIENT  │       │  PRODUIT │      │  estUnique    │
└────┬─────┘       └────┬─────┘      └───────┬───────┘
     │                  │ 1,N                │ 1,N
   1,N│                 │            ┌───────▼───────┐
     │           ┌──────▼──────┐     │ATTRIBUTOPTION │
     │           │   VARIANTE  │     └───────┬───────┘
     │           │  stock      │             │
     │           │  prixModif  │◄────────────┘
     │           └──────┬──────┘   (via VarianteItem)
     │                  │ 1,N
     │           ┌──────▼──────┐
     │           │LIGNECOMMANDE│
     │           └──────┬──────┘
     │                  │ N,1
   1,N│           ┌─────▼──────┐
     └───────────►│  COMMANDE  │──► FACTURE ──► PAIEMENT(S)
                  └────────────┘
                        │
                        └──────────► TICKET (si TICKET)

Règles métier :
• USER a exactement 1 rôle : VENDEUR ou CLIENT (jamais les deux)
• Devis EN_ATTENTE → ACCEPTE = création automatique d'une Commande
• Commande FACTURE → Facture générée automatiquement
• Commande TICKET → Ticket généré + client anonyme créé si besoin
• Variante.stock décrémenté à chaque LigneCommande validée
• Si AttributType.estUnique = true → LigneCommande.quantite forcée à 1
• StatutPaiement calculé : NON_PAYE / PARTIEL / SOLDE selon somme des paiements
```

---
## 👥 Diagramme de classes — Rôles & responsabilités
┌─────────────────────────────────────────────────────────────────────────┐
│                              <<abstract>>                               │
│                                  USER                                   │
│                     email · passwordHash · role                         │
└──────────────────────────┬──────────────────┘└──────────────────────────
│
┌────────────┴────────────┐         ┌────────────┴────────────┐
│                         │         │                         │
│                         │         │                         │
│      role = VENDEUR     │         │      role = CLIENT      │
▼                         ▼         ▼                         ▼
┌──────────────────────────┐        ┌──────────────────────────┐
│         VENDEUR          │        │         CLIENT           │
│  boutiqueNom             │        │  type: LEGAL | ANONYME   │
├──────────────────────────┤        ├──────────────────────────┤
│ + gérerCatalogue()       │        │ + soumettreDevis()       │
│ + créerProduit()         │        │ + consulterDevis()       │
│ + gérerVariantes()       │        │ + consulterCommandes()   │
│ + consulterDevis()       │        │ + consulterFactures()    │
│ + accepterDevis()        │        │ + payerParCarte()        │
│ + refuserDevis()         │        └──────────────────────────┘
│ + gérerCommandes()       │
│ + confirmerCommande()    │        ┌──────────────────────────┐
│ + livrerCommande()       │        │     CLIENT ANONYME       │
│ + consulterFactures()    │        │  (pas de compte USER)    │
│ + enregistrerPaiement()  │        ├──────────────────────────┤
│ + émettreTicketCaisse()  │        │ créé automatiquement     │
│ + consulterTickets()     │        │ lors d'une vente caisse  │
│ + consulterDashboard()   │        └──────────────────────────┘
└──────────────────────────┘
Règles :

Un USER est soit VENDEUR soit CLIENT — jamais les deux
CLIENT ANONYME n'a pas de compte : userId = null
Seul le VENDEUR voit le dashboard et émet des tickets
Seul le CLIENT peut initier un devis
Les deux peuvent payer par carte, mais :
└─ CLIENT : carte uniquement
└─ VENDEUR : carte + espèces + virement + chèque


---
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