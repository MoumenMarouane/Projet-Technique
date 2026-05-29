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
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Structure du projet](#-structure-du-projet)
- [Rôles & permissions](#-rôles--permissions)

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
    │◄── Commande auto ────────│
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
- **Commandes** — Suivi des statuts : `EN_ATTENTE` → `CONFIRMEE` → `EN_COURS` → `LIVREE`
- **Facturation** — Génération automatique HT/TVA/TTC à la confirmation de commande
- **Paiements** — Enregistrement espèces, virement, chèque, carte bancaire
- **Tickets de caisse** — Interface de caisse directe pour ventes anonymes
- **Dashboard** — CA réel, commandes, top produits, graphiques analytiques (Recharts)

### 🛒 Côté Client
- **Devis** — Sélection boutique + produits + variantes, soumission au vendeur
- **Commandes** — Suivi de l'avancement en temps réel
- **Factures** — Consultation de ses factures et paiement en ligne par carte
- **Paiement carte** — Aperçu interactif de la carte, détection Visa/Mastercard, validation Luhn

---

## 🛠️ Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| **Back-end** | NestJS + TypeScript | API REST, logique métier, auth JWT |
| **ORM** | Prisma 6 | Modélisation BDD, migrations, client typé |
| **Base de données** | PostgreSQL (Supabase) | Persistance relationnelle |
| **Stockage** | Supabase Storage | Images produits |
| **Front-end** | React 18 + TypeScript + Vite | Interface utilisateur |
| **Styles** | Tailwind CSS | UI dark mode moderne |
| **État global** | Zustand | Auth store, rehydratation depuis JWT |
| **Graphiques** | Recharts | Dashboard analytique |
| **Auth** | JWT + bcrypt | Tokens signés, mots de passe hachés |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONT-END (React)                     │
│   Pages: Dashboard · Produits · Devis · Commandes       │
│          Factures · Tickets · Paiement                   │
│   Store: Zustand (authStore — rehydratation JWT)         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────────┐
│                   BACK-END (NestJS)                      │
│   Modules: auth · vendeurs · clients · categories       │
│            produits · devis · commandes · factures      │
│            tickets · dashboard                          │
│   Guards: JwtAuthGuard · @CurrentUser()                 │
└──────────────────────┬──────────────────────────────────┘
                       │ Prisma Client
┌──────────────────────▼──────────────────────────────────┐
│              PostgreSQL (Supabase)                       │
│   Users · Vendeurs · Clients · Produits · Variantes     │
│   Devis · Commandes · Factures · Paiements · Tickets    │
└─────────────────────────────────────────────────────────┘
```

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

# Configurer les variables d'environnement
cp .env.example .env

# Générer le client Prisma et appliquer les migrations
npx prisma generate
npx prisma migrate deploy

# Démarrer en développement
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer
npm run dev
```

---

## 🔐 Variables d'environnement

### Backend — `.env`

```env
DATABASE_URL="postgresql://..."       # URL de connexion Supabase (avec pooler)
DIRECT_URL="postgresql://..."         # URL directe pour les migrations Prisma
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
│   │   ├── vendeurs/          # Profil vendeur, boutique
│   │   ├── clients/           # Clients normaux + anonymes
│   │   ├── categories/        # Catégories + axes + options
│   │   ├── produits/          # Catalogue + variantes + images
│   │   ├── devis/             # Cycle devis
│   │   ├── commandes/         # Cycle commande + tickets anonymes
│   │   ├── factures/          # Facturation + paiements
│   │   ├── tickets/           # Tickets de caisse
│   │   ├── dashboard/         # Stats agrégées
│   │   ├── common/            # Guards, décorateurs
│   │   └── prisma/            # Service Prisma
│   └── prisma/
│       └── schema.prisma      # Schéma complet avec variantes
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard/
    │   │   ├── Produits/
    │   │   ├── Devis/         # DevisForm (client) + liste (vendeur)
    │   │   ├── Commandes/     # CommandeDetail
    │   │   ├── Factures/      # PaiementForm (Luhn + aperçu carte)
    │   │   └── Tickets/       # Interface de caisse
    │   ├── services/          # API calls (axios)
    │   ├── store/
    │   │   └── authStore.ts   # Zustand + rehydratation JWT
    │   └── components/
    │       └── layout/        # TopBar, Sidebar
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
| Payer par carte bancaire | ✅ | ✅ |
| Enregistrer espèces / virement / chèque | ❌ | ✅ |
| Accéder au dashboard | ❌ | ✅ |

---

## 🧩 Modèle de données — variantes

Le cœur du système : chaque produit peut avoir plusieurs **variantes** (combinaisons d'attributs), chacune avec son propre stock.

```
Categorie ──► AttributType (ex: "Couleur", "Taille")
                    └──► AttributOption (ex: "Rouge", "39")

Produit ──► Variante ──► VarianteItem ──► AttributOption
              └── stock: 5
              └── prixModif: null
```

Exemple concret — Nike Air Force :
```
Blanc / 38  → stock: 10
Blanc / 39  → stock: 5   ← c'est cette variante précise qui est commandée
Noir  / 38  → stock: 0   ← désactivée automatiquement (rupture)
Noir  / 39  → stock: 3
```

---

<div align="center">

*Projet réalisé dans le cadre d'un stage technique — Licence Pro Informatique*
*École Supérieure de Technologie de Fès — 2025-2026*

**Marouane MOUMEN**
**Outmane ALAMI**

</div>