# CGI-242 — Migration vers React Native + Expo

## Contexte

CGI-242 est l'application de reference pour le Code General des Impots du Congo - Edition 2026. Projet autonome : mobile natif (Expo/React Native) + backend Express/Prisma + IA fiscale (Claude).

---

## Architecture

```
Mobile (Expo/React Native)       Server (Express)            Claude API
┌────────────────────┐     POST /api/chat/message/stream     ┌──────────┐
│ Chat IA fiscal     │ ──────── SSE ──────────────────────→  │ Anthropic│
│ Code CGI 2026      │ ←──── chunks + done ───────────────── │ Haiku 4.5│
│ Simulateurs        │                                       └──────────┘
│ Dashboard          │     GET/POST /api/auth/*
└────────────────────┘     GET/DELETE /api/chat/*
                                    ↓
                           PostgreSQL (Prisma)
```

---

## Stack finale

| Couche | Technologie |
|--------|-------------|
| **Mobile + Web** | React Native + Expo (SDK 52) |
| **Navigation** | Expo Router (file-based routing) |
| **UI** | NativeWind (TailwindCSS natif) |
| **State** | Zustand + React Query |
| **Langage** | TypeScript |
| **Backend** | Express + Prisma + PostgreSQL |
| **Auth** | JWT Access + Refresh tokens + MFA/2FA TOTP |
| **IA** | Claude Haiku 4.5 via @anthropic-ai/sdk (appel direct, pas de RAG) |
| **Paiement** | Stripe (a venir) |
| **Monitoring** | Sentry |

---

## Structure du projet cgi-242

```
cgi-242/
├── app/                        # Expo Router (écrans)
│   ├── (auth)/                 # Groupe auth (login, register, forgot)
│   ├── (app)/                  # Groupe app authentifiée
│   │   ├── chat/               # Chat IA fiscal
│   │   ├── code/               # Navigation CGI (tomes, articles)
│   │   ├── simulateurs/        # IRPP, ITS, IS
│   │   ├── dashboard/          # Tableau de bord
│   │   ├── profile/            # Profil utilisateur
│   │   └── subscription/       # Abonnements
│   └── _layout.tsx             # Layout racine
│
├── components/                 # Composants réutilisables
│   ├── ui/                     # Boutons, inputs, cards
│   ├── chat/                   # Composants chat IA
│   ├── fiscal/                 # Composants simulateurs
│   └── code/                   # Composants navigation CGI
│
├── lib/                        # Logique métier
│   ├── api/                    # Client API (React Query)
│   ├── store/                  # Zustand stores
│   ├── hooks/                  # Custom hooks
│   └── utils/                  # Utilitaires
│
├── types/                      # Types TypeScript partagés
│
├── server/                     # Backend Express + Prisma + Claude
│   ├── src/
│   ├── prisma/
│   └── data/
│
├── assets/                     # Images, fonts, icons
│
├── app.json                    # Config Expo
├── tailwind.config.js          # Config NativeWind
├── tsconfig.json               # Config TypeScript
└── package.json
```

---

## Modules à implémenter

### Phase 1 — Fondations ✅
- [x] Setup Expo + TypeScript + NativeWind
- [x] Configuration Expo Router (navigation)
- [x] Zustand stores (auth)
- [x] Client API Axios avec intercepteur token refresh
- [x] Backend Express + Prisma + PostgreSQL

### Phase 2 — Authentification ✅
- [x] Écran Login (email + password)
- [x] Écran Register (création compte + organisation)
- [x] Écran Forgot Password + Reset Password
- [x] Vérification OTP par email
- [x] Gestion JWT (access + refresh tokens)
- [x] Intercepteur auth automatique (401 → refresh → retry)

### Phase 3 — Chat IA (coeur de l'app) ✅
- [x] Service chat backend (Claude Haiku 4.5 via Anthropic SDK)
- [x] Prompts fiscaux CGI 2026 (ITS, IS, IBA, IRCM, IRF) avec taux Art. 86A mis à jour
- [x] Streaming SSE (réponse mot par mot)
- [x] Écran chat mobile avec bulles user/assistant
- [x] Détection salutations vs questions fiscales
- [x] Persistance conversations en BDD (Prisma)
- [x] CRUD conversations (lister, voir, supprimer)
- [x] Lien Chat IA activé dans la sidebar
- [ ] Affichage des sources CGI (citations)
- [ ] Écran liste historique des conversations

### Phase 4 — Code CGI ✅
- [x] Navigation par tomes (Tome 1, Tome 2, Textes non codifiés)
- [x] Recherche d'articles
- [x] Affichage article avec mise en forme
- [ ] Favoris / marque-pages

### Phase 5 — Simulateurs fiscaux ✅
- [x] Calculateur ITS (barème Art. 116)
- [x] Calculateur IS (minimum perception)
- [x] Calculateur Patente
- [x] Calculateur Solde de liquidation IS
- [ ] Historique des simulations

### Phase 6 — Dashboard & Profil (partiel)
- [x] Tableau de bord (stats, échéances fiscales, actions rapides)
- [ ] Profil utilisateur
- [ ] Gestion abonnement (Stripe)
- [ ] Paramètres (thème, notifications)

---

## Fichiers cles du backend

### Routes
- `src/routes/auth.ts` — Authentification (register, login, OTP, reset password)
- `src/routes/chat.ts` — Chat IA fiscal (streaming SSE, CRUD conversations)

### Services
- `src/services/chat.service.ts` — Appel Claude Haiku + gestion conversations Prisma
- `src/services/chat.prompts.ts` — Prompts fiscaux CGI 2026 (bareme ITS, taux IS Art. 86A, IBA, IRCM, IRF)

### Securite
- `src/middleware/auth.ts` — Middleware JWT (requireAuth) + verification blacklist token
- `src/middleware/rateLimit.middleware.ts` — 3 limiters (global, auth, sensitive) via `express-rate-limit`
- `src/services/tokenBlacklist.service.ts` — Blacklist token + revocation sessions via cache in-memory
- `src/services/email.service.ts` — Nodemailer SMTP configurable, fallback console
- `src/services/mfa.service.ts` — TOTP (otpauth), QR code, chiffrement AES-256-GCM
- `src/services/mfa.backup.service.ts` — 10 codes backup hashes bcrypt
- `src/routes/mfa.routes.ts` — 6 endpoints MFA

### Infrastructure
- `prisma/schema.prisma` — Schema DB (User, Organization, Conversation, Message, etc.)

### Approche IA simplifiee
- Connaissances fiscales injectees dans le system prompt (pas de base vectorielle)
- Claude Haiku 4.5 via `@anthropic-ai/sdk` (rapide et economique)
- Streaming SSE pour reponses en temps reel

---

## Avantages

1. **Projet autonome** — pas de dependance externe, tout est dans cgi-242
2. **App vraiment native** — React Native = composants natifs iOS/Android
3. **TypeScript partout** — coherence frontend + backend
4. **IA integree** — Chat fiscal avec Claude, streaming temps reel
5. **OTA Updates** — mises a jour sans passer par les stores (Expo)
6. **Web + Mobile** — un seul codebase via Expo
7. **Architecture simple** — Express + Prisma + Claude, pas de Redis/Qdrant/Embeddings

---

*Document généré le 22 février 2026 — Mis à jour le 26 février 2026 (Chat IA + SaaS + Sécurité implémentés)*
