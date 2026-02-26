# CGI-242 Mobile

Application mobile du **Code General des Impots du Congo** (edition 2026).

## Fonctionnalites

- **Code CGI** : consultation de 7 000+ articles avec recherche et lecture vocale
- **Simulateurs fiscaux** : ITS (impot sur les salaires), IS (impot sur les societes), Patente
- **Echeances fiscales** : calendrier des obligations fiscales triees par proximite
- **Mode hors-ligne** : Code CGI et simulateurs accessibles sans connexion

## Prerequis

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI pour les builds (`npm install -g eas-cli`)

## Installation

```bash
# Cloner le depot
git clone https://github.com/normxai/cgi-242.git
cd cgi-242/mobile

# Installer les dependances
npm install

# Configurer l'environnement
cp .env.example .env
# Editer .env avec vos valeurs (API URL, Sentry DSN)
```

## Lancement

```bash
# Demarrer le serveur de developpement
npm start

# Lancer sur une plateforme specifique
npm run web       # Navigateur
npm run android   # Emulateur Android
npm run ios       # Simulateur iOS
```

## Tests et qualite

```bash
# Tests unitaires (31 tests)
npm test

# Verification TypeScript
npm run typecheck

# Linting
npm run lint

# Formatage
npm run format
```

## Build et deploiement

```bash
# Preview (APK interne)
eas build --profile preview --platform android

# Production
eas build --profile production --platform all
```

Les builds sont automatises via GitHub Actions (`.github/workflows/ci.yml`) :
- Push sur `main`/`develop` : TypeScript check + tests
- Merge sur `main` : build EAS production

## Architecture

```
app/
  (auth)/          # Ecrans d'authentification (login, register, OTP, reset)
  (app)/           # Ecrans principaux (dashboard, code CGI, simulateurs)
components/        # Composants reutilisables (ErrorBoundary, TreeNode, TableRow)
lib/
  api/             # Client HTTP (axios) + endpoints auth
  data/            # Chargement et recherche des donnees CGI
  hooks/           # Hooks (useDebounce, useOnlineStatus)
  services/        # Logique metier (calcul ITS, IS, Patente)
  store/           # State management (Zustand)
data/              # 2.9 MB de donnees JSON du CGI 2026
```

## Variables d'environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `EXPO_PUBLIC_API_URL` | URL de l'API backend | Oui |
| `EXPO_PUBLIC_SENTRY_DSN` | DSN Sentry pour le monitoring | Non |

Voir `.env.example` pour plus de details.

## Strategie offline

Les donnees du CGI (2.9 MB de fichiers JSON dans `data/`) sont embarquees dans le bundle de l'application. Elles sont chargees de maniere differee (lazy loading) a l'ouverture du Code CGI.

- **Code CGI** : toujours disponible (donnees locales)
- **Simulateurs** : toujours disponibles (calcul 100% client)
- **Authentification** : necessite une connexion internet
- **Chat IA** : necessite une connexion internet (a venir)

Une banniere jaune "Mode hors-ligne" s'affiche quand la connexion est perdue (detection toutes les 15 secondes sur mobile, evenements navigateur sur web).

## Monitoring

Les erreurs de production sont envoyees a **Sentry** quand le DSN est configure. En mode developpement, Sentry est desactive et les erreurs s'affichent dans la console.

## Licence

Proprietary - NormX AI
