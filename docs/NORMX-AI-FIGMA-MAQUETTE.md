# NORMX AI — Résumé Complet pour Maquette Figma

## Vision Globale

**NORMX AI** est une plateforme SaaS professionnelle de conformité fiscale, juridique et comptable pour l'Afrique (Congo-Brazzaville en premier). Elle se décline en **5 produits** :

---

## Les 5 Produits NORMX

| Produit | Description | Statut |
|---------|-------------|--------|
| **NORMX Tax** | Code Général des Impôts 2026, simulateurs fiscaux, calendrier fiscal, audit facture, assistant IA fiscal | ✅ Actif |
| **NORMX Legal** | Code Social (travail, sécurité sociale, conventions collectives, OIT) | 🔧 En cours |
| **NORMX Compta** | Comptabilité SYSCOHADA | 🔜 À venir |
| **NORMX États** | États financiers SYSCOHADA + SYCEBNL avec RAG et agent IA | 🔜 À venir |
| **NORMX Paie** | Paie Congo-Brazzaville (CGI 2026, 16 conventions collectives) | 🔧 En cours |

---

## Identité Visuelle

### Couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary (Or/Doré)** | `#D4A843` | Boutons principaux, accents, bulles user |
| **Secondary (Bleu marine)** | `#1A3A5C` | Header, sidebar, fond dark mode |
| **Accent light** | `#c49a38` | Hover, variantes or |
| **Accent dark** | `#e0b84f` | Accents en dark mode |
| **Background light** | `#f3f4f6` | Fond général light |
| **Card light** | `#ffffff` | Cartes et panneaux |
| **Text primary** | `#1f2937` | Texte principal |
| **Text secondary** | `#6b7280` | Texte secondaire |
| **Text muted** | `#9ca3af` | Texte désactivé |
| **Border** | `#e5e7eb` | Bordures light |
| **Sidebar active** | `#FDF8EE` | Item sidebar actif |
| **Citations bg** | `#fef9ee` | Fond citations IA |
| **Danger** | `#ef4444` | Erreurs, suppression |
| **Success** | `#22c55e` | Validation, succès |
| **Warning** | `#f59e0b` | Alertes, attention |

### Typographie

| Famille | Poids | Usage |
|---------|-------|-------|
| **PlayFair Display** | Bold 700, Black 900 | Titres, headings |
| **Outfit** | Light 300 → Black 900 | Corps, labels, boutons |

### Tailles de texte

- Page title : 24px
- Section title : 18px
- Card title : 16px
- Body : 16px
- Secondary : 14px
- Label : 13px
- Small : 12px

### Spacing

- Padding : 8 / 12 / 16 / 20 / 24 / 40 px
- Gap : 6 / 8 / 10 / 12 / 16 / 24 px
- Border radius : 6 / 8 / 10 / 12 / 14 px

### Modes

- **Light mode** : fond gris clair `#f3f4f6`, cartes blanches, header bleu marine `#1A3A5C`
- **Dark mode** : fond bleu marine `#1A3A5C`, texte crème `#e8e6e1`, accents dorés `#D4A843`

---

## Architecture des Écrans (47 routes)

### 1. Landing Page (Web, non connecté)

| Section | Contenu |
|---------|---------|
| **Header** | Logo NORMX + navigation + CTA connexion |
| **Hero** | Accroche principale + illustration + CTA |
| **Products** | Présentation des 5 produits NORMX (Tax, Legal, Compta, États, Paie) |
| **Features** | 16 fonctionnalités clés en grille |
| **Pricing** | Tableau comparatif des 5 plans |
| **Contact** | Formulaire + email support |
| **CTA** | Mise en avant assistant IA |
| **Footer** | Liens légaux + copyright + réseaux |

### 2. Authentification (8 écrans)

| Écran | Éléments |
|-------|----------|
| **Login email** | Champ email + bouton continuer + liens inscription/légal |
| **Mot de passe** | Champ mot de passe (œil toggle) + bouton connexion + lien oublié |
| **Inscription** | Nom entreprise + prénom/nom + email + checkbox CGU + sélection plan |
| **MFA Verify** | Champ code 2FA + retry |
| **Verify OTP** | Champ code OTP |
| **Mot de passe oublié** | Champ email + instructions |
| **Réinitialisation** | Nouveau mot de passe + confirmation |
| **Déconnexion** | Nettoyage session + redirection |

### 3. Dashboard (Accueil connecté)

#### Desktop

- **Salutation dynamique** (Bonjour/Bon après-midi/Bonsoir + prénom)
- **4 cartes stats** (grille 2×2) :
  - 📄 2 181 articles
  - 🧮 16 simulateurs
  - 📚 64 références TFNC
  - 📅 Édition 2026
- **Codes & Législation** (grille 2×2) :
  - Code Général des Impôts (vert) — actif
  - Code Social (bleu) — actif
  - Code des Hydrocarbures (orange) — bientôt
  - Code Douanier (violet) — bientôt
- **Actions rapides** (liste verticale) :
  - Consulter le CGI
  - Simuler un impôt
  - Discuter avec l'IA
  - Auditer une facture
- **Échéances fiscales** du mois en cours (grille 3 colonnes)
- **Footer** avec numéro de version

#### Mobile

- Version simplifiée en cartes verticales pleine largeur (`HomeCards`)

### 4. Navigateur de Code (Split view)

#### Desktop

```
┌──────────────────────────────────────────┐
│  [CGI 2026 ▼]  [🔍 Rechercher...]       │
├──────────────┬───────────────────────────┤
│  Sommaire    │  Contenu article          │
│  (32%)       │  (68%)                    │
│              │                           │
│  ▶ Tome 1   │  Art. XXX                 │
│    ▶ Partie 1│  Titre de l'article      │
│      ▶ Ch.1 │  Texte complet...         │
│        Art.1│  Mots-clés: [tag] [tag]   │
│        Art.2│  Références liées         │
│    ▶ Partie 2│                           │
│  ▶ Tome 2   │                           │
│  ▶ TFNC     │                           │
│  ▶ Index    │                           │
└──────────────┴───────────────────────────┘
```

#### Sélecteur de code

- CGI 2026 (par défaut)
- Code Social
- Code des Hydrocarbures (bientôt)
- Code Douanier (bientôt)

#### Mobile

- Vue pleine largeur empilée (`MobileCGIBrowser`)
- Navigation sommaire → article

### 5. Hub Simulateurs (16 outils)

Grille de cartes : 3 colonnes desktop / 1 colonne mobile

| # | Simulateur | Icône | Réf. légale |
|---|-----------|-------|------------|
| 1 | Solde de liquidation | 📊 | CGI 2026 |
| 2 | IS (Impôt sur les Sociétés) | 🏢 | Art. 122+ |
| 3 | Retenue à la source | ✂️ | Art. 200+ |
| 4 | IS Parapétrolier | 🛢️ | Pétrole |
| 5 | IBA (Bénéfices Agricoles) | 🌾 | Art. 85+ |
| 6 | IRCM | 💳 | Art. 175+ |
| 7 | IRF Loyers | 🏠 | Art. 190+ |
| 8 | Taxe Immobilière | 🏗️ | Art. 350+ |
| 9 | **ITS (Salaires)** | 💰 | Art. 116 |
| 10 | **Paie complète** | 📋 | CNSS+ITS+TUS |
| 11 | Enregistrement | 📝 | Tome 2 |
| 12 | Cession de parts | 📈 | Art. 240+ |
| 13 | Contribution foncière | 🏞️ | Art. 300+ |
| 14 | Patente | 🏪 | Art. 314 |
| 15 | IGF | 💹 | Art. 155+ |
| 16 | TVA | 🧾 | Art. 400+ |

Chaque carte affiche : icône couleur + titre + badge "CGI 2026" + sous-titre + réf. légale + 🔒 si restreint par plan

#### Restrictions par plan

- **FREE** : 5 simulateurs (essai 7 jours)
- **STARTER** : 5 simulateurs (ITS, TVA, IS, Paie, Patente)
- **PRO+** : 16 simulateurs

### 6. Simulateur Individuel (Formulaire + Résultat)

#### Structure commune

- Champs de saisie typés (nombre, sélection, toggle)
- **Zone résultat** mise en valeur :
  - Montant principal (grande taille)
  - Détail du calcul
  - Taux effectif
- Bouton calculer
- Avertissement validité légale

#### Exemple : Simulateur ITS

- Entrées : Salaire brut, déductions, personnes à charge
- Sortie : Montant ITS net, taux effectif, détail tranches

### 7. Calendrier Fiscal 2026

- Grille mensuelle avec navigation ◀ / ▶
- Cellules jour :
  - Numéro du jour
  - Couleur de fond si obligation
  - Badge compteur
- **Légende** : Aujourd'hui / Obligation (rouge) / Récurrent (orange)
- **Panel jour sélectionné** :
  - Cartes obligations (grille 3 colonnes desktop)
  - Icône + titre + description + badge récurrent/ponctuel
- **Aperçu prochaine échéance** si aucun jour sélectionné

### 8. Chat IA (Assistant fiscal)

#### Layout

```
┌─────────────────────────────────────────┐
│ [📜 Historique] [+ Nouvelle conversation]│
├──────────┬──────────────────────────────┤
│ Historique│  Zone de conversation        │
│ (sidebar)│                              │
│          │  🤖 Bonjour, je suis votre   │
│ Conv. 1  │     assistant fiscal IA...    │
│ Conv. 2  │                              │
│ Conv. 3  │  👤 Quel est le taux IS ?     │
│          │                              │
│          │  🤖 Selon l'Art. 122 du CGI   │
│          │     2026, le taux de l'IS...  │
│          │     📎 [Art. 122] [Art. 123]  │
│          ├──────────────────────────────┤
│          │ [💬 Posez votre question...]  │
│          │                      [Envoyer]│
└──────────┴──────────────────────────────┘
```

#### Fonctionnalités

- Bulles : user (doré `#D4A843`) / assistant (blanc/gris)
- Streaming temps réel (texte progressif)
- Citations articles de loi (RAG avec sources Qdrant)
- Historique persistant
- Suggestions de questions (état vide)
- File d'attente hors-ligne
- Mobile : historique en overlay

### 9. Audit Facture

#### Étapes

1. **Sélection type document** : Facture / Relevé bancaire / Bon de commande / DAS2 / Note de frais
2. **Upload fichier** : Zone drag & drop (PDF, JPEG, PNG — 10 Mo max)
3. **Analyse** : Bouton + état de chargement
4. **Résultats** :
   - **Score** conformité (X/Y mentions — couleur rouge/orange/vert)
   - **Langue** : check ✅ ou ❌
   - **Taux TVA** : alerte si incohérent
   - **Mentions obligatoires** (Art. 32) : liste avec ✅/❌ + valeurs trouvées
   - **Risques identifiés** : liste warnings + montants
   - **Recommandations** : actions correctives
5. **Historique audits** : tableau (date, type, score) cliquable

### 10. Menu Plus (Navigation secondaire)

- **Carte utilisateur** : avatar initiales + nom + email + chevron
- **Items menu** (pile verticale) :
  1. 👤 Profil
  2. ⚙️ Paramètres
  3. 🔒 Sécurité (2FA)
  4. 💳 Abonnement
  5. 🧾 Factures
  6. 📄 CGU
  7. 🔐 Politique de confidentialité
  8. ℹ️ Mentions légales
- **Bouton déconnexion** (rouge, en bas)

### 11. Profil Utilisateur

- **Avatar** : cercle avec initiales + email
- **Formulaire** :
  - Prénom (requis)
  - Nom (requis)
  - Téléphone (optionnel, validé)
  - Profession (optionnel)
  - Membre depuis (lecture seule)
- **Bouton sauvegarder** + message succès/erreur

### 12. Paramètres

| Section | Éléments |
|---------|----------|
| **Compte** | Email (lecture seule) + lien changer mot de passe |
| **Sécurité** | Lien configuration 2FA |
| **Apparence** | Toggle dark mode (on/off) |
| **Langue** | Sélecteur FR / EN |
| **Abonnement** | Plan actuel (badge) + questions utilisées X/Y + date renouvellement |
| **Activité** | Statistiques d'utilisation |
| **Gestion** | Liens : Organisation, Permissions, Journal audit, Analytiques, Admin |
| **À propos** | Version + Édition CGI 2026 + liens légaux |

### 13. Gestion Organisation (Multi-tenant)

#### Sans organisation

- Formulaire création (champ nom + bouton)

#### Avec organisation

- **En-tête** : Nom org (éditable owner) + plan + sièges payés + membres actifs
- **Membres** : Liste avec nom/email + rôle (OWNER/ADMIN/MEMBER) + date + menu ⋮
- **Invitations** : Champ email + sélecteur rôle + sièges restants
- **Invitations en attente** : Liste + bouton annuler
- **Sièges supplémentaires** (owner) : Sièges actuels + input ajout + calcul prix (remises volume)
- **Zone danger** (owner) : Supprimer / Restaurer / Supprimer définitivement

### 14. Abonnement / Paywall

#### Tableau des plans

| | FREE | STARTER | PRO | TEAM | ENTERPRISE |
|---|---|---|---|---|---|
| **Prix** | 0€ | 69€/an | 149€/an | 299€/an | 500€+/an |
| **Questions IA** | 5 total | 15/mois | 30/mois | 200/mois | Custom |
| **Audits** | 3 total | 10/mois | 30/mois | 100/mois | Custom |
| **Simulateurs** | 5 (essai) | 5 | 16 | 16 | 16 |

#### Packs additionnels

| Pack | Questions | Audits | Prix |
|------|-----------|--------|------|
| S | 10 | 10 | 9€ |
| M | 30 | 30 | 19€ |
| L | 75 | 75 | 39€ |
| XL | 150 | 150 | 69€ |

#### Remises volume (Teams)

- 3-4 utilisateurs : **-10%**
- 5-9 utilisateurs : **-15%**
- 10+ utilisateurs : **-20%**

#### Écran Paywall (abonnement expiré)

- Tableau plans détaillé
- Packs volumes
- Formulaire contact (sujet + message)
- Bouton déconnexion

---

## Navigation

### Desktop

```
┌───────────────────────────────────────────┐
│  Header : NORMX Tax + Fil d'Ariane       │
├───────────┬───────────────────────────────┤
│  Sidebar  │  Contenu principal            │
│  (220px)  │                               │
│  ───────  │                               │
│  🏠 Dashboard │                           │
│  📖 Code     │                            │
│  🧮 Simulat. │                            │
│  📅 Calendr. │                            │
│  💬 Chat IA  │                            │
│  📋 Audit    │                            │
│           │                               │
│  (60px    ├───────────────────────────────┤
│  collapsed)│  TabBar (onglets ouverts)    │
└───────────┴───────────────────────────────┘
```

### Mobile

```
┌─────────────────────────┐
│  Header + actions       │
├─────────────────────────┤
│                         │
│  Contenu plein écran    │
│                         │
├─────────────────────────┤
│ 🏠  📖  🧮  📅  💬  ⋯  │
│ Home Code Sim Cal Chat +│
└─────────────────────────┘
```

---

## Données Embarquées

| Catégorie | Fichiers | Contenu |
|-----------|----------|---------|
| **CGI 2026** (Tome 1+2) | ~95 | IRPP, IS, IBA, TVA, Enregistrement, Timbre |
| **TFNC** (Textes non codifiés) | ~30 | Investissements, Mines, Pétrole, Taxes diverses, TVA |
| **Conventions internationales** | 6 | France, Italie, Chine, Rwanda, Maurice, CEMAC |
| **Code Social** | 52 | Code du travail (10 titres), CNSS, CAMU, ONEMO, ACPE, FONEA, INTS, saisie-arrêt, jours fériés |
| **Conventions collectives** | 16 | BTP, Commerce, Industrie, Pétrole, Para-pétrole, Mines, Forêt, Agri-forêt, NTIC, BAM, Hôtellerie, Aérien, Auxiliaires transport, Pêche, Information-Communication, Personnel domestique |
| **Index alphabétique** | 1 | A-Z avec renvois articles |
| **TOTAL** | **219 fichiers JSON** | **~70 000 lignes — 2 181 articles** |

---

## Backend

| Composant | Technologie | Détail |
|-----------|-------------|--------|
| **API** | Node.js / Express | 17 fichiers routes |
| **Base de données** | PostgreSQL (Prisma) | Users, Orgs, Conversations, Subscriptions, Invoices |
| **IA / RAG** | Qdrant (vectoriel) | Recherche sémantique + agents orchestrés (80 Ko logique) |
| **Emails** | Service transactionnel | Inscriptions, invitations, alertes |
| **Notifications** | Push + alertes fiscales | Échéances, rappels |
| **Sécurité** | MFA/2FA, RBAC, sessions | Anti-capture écran (mobile natif) |

---

## Services de Calcul (19 simulateurs)

| Service | Fichier | Description |
|---------|---------|-------------|
| Paie complète | `paie.service.ts` | CNSS + ITS + TUS + TOL + CAMU |
| ITS | `its.service.ts` | Barème progressif Art. 116 |
| IS | `is.service.ts` | Impôt sur les sociétés |
| IBA | `iba.service.ts` | Bénéfices agricoles |
| IGF | `igf.service.ts` | Impôt global forfaitaire |
| Patente | `patente.service.ts` | Contribution patente Art. 314 |
| TVA | `tva.service.ts` | Taxe sur la valeur ajoutée |
| IRCM | `ircm.service.ts` | Revenus capitaux mobiliers |
| IRF Loyers | `irf-loyers.service.ts` | Retenue revenus fonciers |
| Retenue source | `retenue-source.service.ts` | Retenue à la source |
| Enregistrement | `enregistrement.service.ts` | Droits d'enregistrement |
| Contribution foncière | `contribution-fonciere.service.ts` | Contribution foncière |
| Cession de parts | `cession-parts.service.ts` | Plus-values sur cessions |
| Taxe immobilière | `taxe-immobiliere.service.ts` | Taxe immobilière |
| IS Parapétrolier | `is-parapetrolier.service.ts` | IS sous-traitants pétrole |
| Solde de liquidation | `solde-liquidation.service.ts` | Solde de tout compte |
| Calendrier fiscal | `calendrier-fiscal.ts` | Échéances 2026 |
| Utilitaires fiscaux | `fiscal-common.ts` | Fonctions partagées |

---

## Composants UI Clés

### Layout

| Composant | Description |
|-----------|-------------|
| `Sidebar` | Navigation desktop repliable (60px → 220px) |
| `MobileTabBar` | Barre 6 onglets en bas (mobile) |
| `MobileHeader` | En-tête mobile (retour, recherche, thème) |
| `TabsBar` | Onglets ouverts style navigateur (desktop) |

### Chat

| Composant | Description |
|-----------|-------------|
| `HistoryPanel` | Liste conversations (sidebar) |
| `MessageBubble` | Bulle message individuel |
| `StreamingBubble` | Message en streaming temps réel |
| `ChatInput` | Champ saisie + bouton envoyer |
| `EmptyState` | État initial avec suggestions |

### Simulateurs

| Composant | Description |
|-----------|-------------|
| `SimulateurLayout` | Wrapper commun tous simulateurs |
| `NumberField` | Champ numérique validé |
| `OptionButtonGroup` | Options radio-style |
| `ResultHighlight` | Affichage résultat principal |

### Code

| Composant | Description |
|-----------|-------------|
| `TreeNode` | Nœud arborescent (sommaire CGI) |
| `ContentPanel` | Détail article |
| `MobileCGIBrowser` | Navigateur code mobile |

### Génériques

| Composant | Description |
|-----------|-------------|
| `FloatingCalculator` | Calculatrice flottante toujours visible |
| `NotificationBell` | Indicateur notifications |
| `SessionExpiredModal` | Modal expiration session |
| `ToastProvider` | Notifications toast (succès/erreur/info) |

---

## 16 Écrans Clés à Maquetter

| # | Écran | Priorité |
|---|-------|----------|
| 1 | **Landing page** (Hero + Products + Pricing) | 🔴 Haute |
| 2 | **Login / Inscription** | 🔴 Haute |
| 3 | **Dashboard desktop** (stats + codes + actions + échéances) | 🔴 Haute |
| 4 | **Dashboard mobile** | 🔴 Haute |
| 5 | **Navigateur de code** (split view arborescence + article) | 🔴 Haute |
| 6 | **Hub simulateurs** (grille 16 outils) | 🔴 Haute |
| 7 | **Simulateur individuel** (formulaire + résultat) | 🟡 Moyenne |
| 8 | **Calendrier fiscal** | 🟡 Moyenne |
| 9 | **Chat IA** (conversation + citations + historique) | 🔴 Haute |
| 10 | **Audit facture** (upload + résultats conformité) | 🟡 Moyenne |
| 11 | **Menu Plus** (navigation secondaire) | 🟢 Basse |
| 12 | **Paramètres** | 🟢 Basse |
| 13 | **Abonnement** (plans + quotas) | 🟡 Moyenne |
| 14 | **Profil utilisateur** | 🟢 Basse |
| 15 | **Gestion organisation** (membres + invitations) | 🟡 Moyenne |
| 16 | **Paywall** (plans + packs + contact) | 🟡 Moyenne |

### Variantes à produire

Chaque écran doit exister en :

- **3 breakpoints** : Mobile (375px) / Tablet (768px) / Desktop (1440px)
- **2 thèmes** : Light / Dark

---

## Contact

- **Facturation** : facturation@normx-ai.com
- **Repo** : https://github.com/CGI-242/cgi.git
- **VPS** : 51.83.75.203
