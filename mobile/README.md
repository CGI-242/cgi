# CGI 242 - Intelligence Fiscale IA

Application mobile du **Code Général des Impôts du Congo** (édition 2026).
Consultation des 7 000+ articles, simulateurs fiscaux (ITS, IS, Patente), assistant IA fiscal et échéances fiscales.

---

## Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| Framework | React Native 0.81, Expo 54 |
| Routing | Expo Router 6 |
| Langage | TypeScript 5.9 |
| State | Zustand 5 |
| API | Axios |
| UI | NativeWind 4 / TailwindCSS 3, @expo/vector-icons |
| Auth | JWT + MFA (TOTP), OTP, Secure Store |
| i18n | i18next / react-i18next (français) |
| Monitoring | Sentry |
| Voix | expo-speech-recognition (recherche vocale) |
| Tests | Jest, ts-jest (31 tests) |
| Build | EAS CLI |

---

## Prérequis

- **Node.js** >= 18
- **npm** >= 9
- **Expo CLI** (`npx expo`)
- **EAS CLI** (pour les builds) : `npm install -g eas-cli`
- Un émulateur Android / simulateur iOS ou l'app **Expo Go**

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/normxai/cgi-242.git
cd cgi-242/mobile

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec l'URL de l'API backend
```

### Variables d'environnement

| Variable | Description | Obligatoire | Exemple |
|----------|-------------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | URL de l'API backend | Oui | `https://api.cgi242.normx.ai/api` |
| `EXPO_PUBLIC_SENTRY_DSN` | DSN Sentry (monitoring) | Non | *(laisser vide pour désactiver)* |

Voir `.env.example` pour plus de détails.

---

## Commandes

```bash
npm start          # Serveur de développement Expo
npm run web        # Lancer sur navigateur web
npm run android    # Lancer sur émulateur Android
npm run ios        # Lancer sur simulateur iOS
npm test           # Lancer les tests Jest (31 tests)
npm run test:ci    # Tests avec couverture (CI)
npm run typecheck  # Vérification TypeScript
npm run lint       # ESLint
npm run format     # Prettier
```

---

## Structure du projet

```
mobile/
├── app/                        # Pages (Expo Router file-based routing)
│   ├── (auth)/                 # Écrans d'authentification
│   │   ├── index.tsx           #   Connexion
│   │   ├── register.tsx        #   Inscription
│   │   ├── forgot-password.tsx #   Mot de passe oublié
│   │   ├── reset-password.tsx  #   Réinitialisation
│   │   ├── verify-otp.tsx      #   Vérification OTP
│   │   ├── mfa-verify.tsx      #   Vérification MFA
│   │   └── logout.tsx          #   Déconnexion
│   ├── (app)/                  # Écrans principaux (authentifié)
│   │   ├── index.tsx           #   Tableau de bord
│   │   ├── code/               #   Consultation du CGI
│   │   ├── chat/               #   Assistant IA fiscal
│   │   ├── simulateur/         #   Simulateurs fiscaux (ITS, IS, Patente, Solde)
│   │   ├── profil/             #   Profil utilisateur
│   │   ├── securite/           #   Sécurité & MFA
│   │   ├── organisation/       #   Gestion d'organisation
│   │   ├── permissions/        #   Rôles & permissions
│   │   ├── invitations/        #   Invitations
│   │   ├── abonnement/         #   Abonnement
│   │   ├── analytics/          #   Analytiques d'usage
│   │   ├── audit/              #   Journaux d'audit
│   │   ├── admin/              #   Administration
│   │   ├── parametres/         #   Paramètres
│   │   └── legal/              #   CGU & Confidentialité
│   └── _layout.tsx             # Layout racine (ThemeProvider, Sentry)
│
├── components/                 # Composants réutilisables
│   ├── code/                   #   Navigation CGI, ArticleText, ChapterReader
│   ├── chat/                   #   Bulles de chat, streaming, citations
│   ├── simulateur/             #   Champs numériques, tableaux de résultats
│   ├── auth/                   #   Champs email, mot de passe, OTP
│   ├── organisation/           #   Membres, invitations, header
│   ├── securite/               #   Setup MFA, codes de secours
│   ├── profil/                 #   Formulaire de profil, avatar
│   ├── permissions/            #   Sélecteur de permissions
│   ├── audit/                  #   Logs d'audit, filtres
│   ├── analytics/              #   Tableau de stats, sélecteur de période
│   ├── admin/                  #   Grille de stats admin
│   ├── abonnement/             #   Plans, quotas, actions
│   ├── parametres/             #   Lignes de réglages
│   ├── Sidebar.tsx             #   Barre latérale de navigation
│   ├── ErrorBoundary.tsx       #   Gestionnaire d'erreurs global
│   └── SessionExpiredModal.tsx #   Modal de session expirée
│
├── lib/                        # Logique métier & utilitaires
│   ├── api/                    #   Client Axios, endpoints (auth, chat, admin...)
│   ├── data/                   #   Chargement & recherche des données CGI
│   ├── services/               #   Calculateurs fiscaux (ITS, IS, Patente, Solde)
│   ├── hooks/                  #   Hooks (debounce, online, speech, permissions)
│   ├── store/                  #   Zustand stores (auth, offline queue)
│   ├── theme/                  #   Thème clair/sombre (colors, ThemeContext)
│   └── i18n/                   #   Configuration i18next
│
├── data/                       # Données CGI embarquées (~2.8 Mo, JSON)
├── types/                      # Types TypeScript globaux
├── assets/                     # Icônes, splash screen
├── .github/workflows/          # CI/CD (tests, lint, typecheck)
└── eas.json                    # Configuration EAS Build
```

---

## Fonctionnalités

### Consultation du CGI
- Navigation arborescente des 7 000+ articles (tomes, titres, chapitres, sections)
- **Mode livre** : affichage de tout un chapitre en une seule vue scrollable
- Recherche plein texte avec mise en surbrillance
- Recherche vocale (reconnaissance vocale en français)
- Références croisées entre articles
- Lecture vocale des articles (text-to-speech)
- Disponible hors ligne (données embarquées)

### Simulateurs fiscaux
- **ITS** — Impôt sur les Traitements et Salaires
- **IS** — Impôt sur les Sociétés
- **Patente** — Contribution des patentes
- **Solde de liquidation** — Calcul du solde IS avec acomptes
- Calculs 100% côté client (fonctionnent hors ligne)

### Assistant IA fiscal
- Chat avec un assistant IA spécialisé en fiscalité congolaise
- Streaming en temps réel (SSE)
- Citations et références aux articles du CGI
- Historique des conversations

### Authentification & Sécurité
- Connexion email / mot de passe
- Inscription avec vérification OTP
- Double authentification (MFA/TOTP)
- Codes de secours
- Stockage sécurisé des tokens (Secure Store mobile, cookies HTTP-only web)
- Déconnexion de tous les appareils
- Protection contre la capture d'écran (production)

### Gestion d'équipe
- Organisations multi-utilisateurs
- Invitations par email
- Rôles et permissions granulaires
- Tableau de bord administrateur
- Journaux d'audit avec historique par entité

### Autres
- Thème clair / sombre
- Analytiques d'usage et statistiques membres
- Gestion d'abonnement
- Notifications push
- Détection online/offline avec synchronisation différée
- Internationalisation (français)

---

## Stratégie offline

Les données du CGI (~2.8 Mo de fichiers JSON dans `data/`) sont embarquées dans le bundle. Elles sont chargées en mémoire de manière différée à l'ouverture du Code CGI.

| Fonctionnalité | Hors ligne | En ligne |
|----------------|:----------:|:--------:|
| Code CGI (consultation, recherche) | Oui | Oui |
| Simulateurs fiscaux | Oui | Oui |
| Authentification | Non | Oui |
| Chat IA | Non | Oui |
| Analytics / Audit | Non | Oui |

Une bannière "Mode hors-ligne" s'affiche quand la connexion est perdue (détection toutes les 15s sur mobile, événements navigateur sur web).

---

## Tests

```bash
npm test           # 31 tests unitaires
npm run test:ci    # Avec couverture
```

Les tests couvrent les services de calcul fiscal (`lib/services/__tests__/`) : formules ITS, IS, Patente et Solde de liquidation.

---

## Build & Déploiement

### Développement
```bash
npx expo start
```

### Preview (APK interne)
```bash
eas build --profile preview --platform android
```

### Production
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

### CI/CD

Le workflow GitHub Actions (`.github/workflows/ci.yml`) s'exécute automatiquement :
- **Push sur `main`/`develop`** : TypeScript check + tests + lint
- **Merge sur `main`** : build EAS production

---

## Monitoring

Les erreurs de production sont envoyées à **Sentry** quand le DSN est configuré. En développement, Sentry est désactivé et les erreurs s'affichent dans la console.

---

## Licence

Propriétaire — **NormX AI** (normxai)
