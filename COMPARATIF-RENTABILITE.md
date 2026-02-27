# Comparatif de rentabilite — CGI 242

## 1. Plans tarifaires

| Plan | Questions/mois | Prix/an (XAF) | Essai |
|------|---------------|---------------|-------|
| FREE | 5 | 0 | 7 jours |
| BASIQUE | 20 | 50 000 | - |
| PRO | 50 | 65 000 | - |

---

## 2. Couts API par question

### 2.1 Voyage AI — Embedding (recherche RAG)

| Element | Valeur |
|---------|--------|
| Modele | voyage-multilingual-2 |
| Prix | 0.12 $/MTok |
| Tokens par question | ~50 |
| Cout par question | 0.000006 $ |
| Free tier | 50M tokens/mois (~1M questions gratuites) |

Verdict : cout negligeable, couvert par le free tier dans la majorite des cas.

### 2.2 Claude Sonnet 4 — Generation de reponse

| Element | Prix |
|---------|------|
| Input | 3 $/MTok |
| Output | 15 $/MTok |

Estimation tokens par question :

| Composant | Tokens |
|-----------|--------|
| System prompt (fiscal + regles format) | ~3 500 |
| Contexte RAG (8 articles x ~300 tokens) | ~2 400 |
| Historique conversation (budget 3 000 tokens max) | ~2 000 |
| Message utilisateur | ~100 |
| **Total input** | **~8 000** |
| **Output (reponse fiscale)** | **~800** |

Cout Claude par question :
- Input : 8 000 / 1M x 3$ = 0.024 $
- Output : 800 / 1M x 15$ = 0.012 $
- **Total : ~0.036 $ = ~22 XAF**

### 2.3 Infrastructure (couts fixes mensuels)

| Service | Estimation mensuelle (XAF) |
|---------|---------------------------|
| VPS (4 vCPU, 8 Go RAM) | 10 000 - 20 000 |
| PostgreSQL (meme VPS) | inclus |
| Qdrant (meme VPS) | inclus |
| Nom de domaine + SSL | ~500 |
| **Total infra** | **~12 000 - 22 000** |

---

## 3. Rentabilite par plan

### 3.1 Plan BASIQUE (50 000 XAF/an)

| | Par mois | Par an |
|---|---------|--------|
| Revenu | 4 167 | 50 000 |
| Cout API max (20q x 22 XAF) | 440 | 5 280 |
| **Marge brute** | **3 727** | **44 720** |
| **Taux de marge** | **89%** | **89%** |

### 3.2 Plan PRO (65 000 XAF/an)

| | Par mois | Par an |
|---|---------|--------|
| Revenu | 5 417 | 65 000 |
| Cout API max (50q x 22 XAF) | 1 100 | 13 200 |
| **Marge brute** | **4 317** | **51 800** |
| **Taux de marge** | **80%** | **80%** |

### 3.3 Plan FREE (cout d'acquisition client)

| | 7 jours |
|---|---------|
| Questions max | 5 |
| Cout API max (5q x 22 XAF) | 110 XAF |

Cout d'acquisition : **110 XAF** par prospect — tres faible.

---

## 4. Projections par nombre de clients

### 4.1 Scenario 100% BASIQUE

| Clients | Revenu/an (XAF) | Cout API/an | Cout infra/an | Benefice net/an | Benefice net/mois |
|---------|-----------------|-------------|---------------|-----------------|-------------------|
| 5 | 250 000 | 26 400 | 192 000 | 31 600 | 2 633 |
| 10 | 500 000 | 52 800 | 192 000 | 255 200 | 21 267 |
| 20 | 1 000 000 | 105 600 | 192 000 | 702 400 | 58 533 |
| 50 | 2 500 000 | 264 000 | 192 000 | 2 044 000 | 170 333 |
| 100 | 5 000 000 | 528 000 | 240 000 | 4 232 000 | 352 667 |

### 4.2 Scenario 100% PRO

| Clients | Revenu/an (XAF) | Cout API/an | Cout infra/an | Benefice net/an | Benefice net/mois |
|---------|-----------------|-------------|---------------|-----------------|-------------------|
| 5 | 325 000 | 66 000 | 192 000 | 67 000 | 5 583 |
| 10 | 650 000 | 132 000 | 192 000 | 326 000 | 27 167 |
| 20 | 1 300 000 | 264 000 | 192 000 | 844 000 | 70 333 |
| 50 | 3 250 000 | 660 000 | 192 000 | 2 398 000 | 199 833 |
| 100 | 6 500 000 | 1 320 000 | 240 000 | 4 940 000 | 411 667 |

### 4.3 Scenario mixte realiste (70% BASIQUE / 30% PRO)

| Clients | Revenu/an (XAF) | Cout API/an | Cout infra/an | Benefice net/an | Benefice net/mois |
|---------|-----------------|-------------|---------------|-----------------|-------------------|
| 10 | 545 000 | 76 560 | 192 000 | 276 440 | 23 037 |
| 30 | 1 635 000 | 229 680 | 192 000 | 1 213 320 | 101 110 |
| 50 | 2 725 000 | 382 800 | 192 000 | 2 150 200 | 179 183 |
| 100 | 5 450 000 | 765 600 | 240 000 | 4 444 400 | 370 367 |

---

## 5. Seuil de rentabilite

| Cout infra mensuel | Clients BASIQUE necessaires | Clients PRO necessaires |
|--------------------|----------------------------|------------------------|
| 12 000 XAF | 4 | 3 |
| 16 000 XAF | 5 | 4 |
| 22 000 XAF | 6 | 6 |

**Seuil de rentabilite : 4 a 6 clients payants.**

---

## 6. Risques et protections

### 6.1 Conversations longues (cout tokens eleve)

| Protection | Implementee | Effet |
|------------|-------------|-------|
| Limite messages historique | Oui (10 messages) | Plafonne le contexte |
| Budget caracteres historique | Oui (12 000 chars = ~3 000 tokens) | Cout max garanti |
| MAX_TOKENS reponse | Oui (2 000 tokens) | Plafonne la sortie |

Impact :

| Scenario | Input tokens | Cout/question |
|----------|-------------|---------------|
| 1ere question (pas d'historique) | ~6 000 | 0.024 $ (15 XAF) |
| Conversation longue (budget max) | ~9 000 | 0.036 $ (22 XAF) |
| Sans protection (ancien code 20 msgs) | ~15 000+ | 0.057 $ (35 XAF) |

### 6.2 Abus de quota

| Protection | Implementee |
|------------|-------------|
| Quota mensuel par plan | Oui (5/20/50 questions) |
| Middleware checkQuestionQuota | Oui |
| Increment compteur apres chaque question | Oui |
| Lazy reset mensuel automatique | Oui |
| Expiration annuelle automatique | Oui |

### 6.3 Essai gratuit abuse

| Protection | Implementee |
|------------|-------------|
| Limite 5 questions | Oui |
| Expiration 7 jours | Oui |
| Cout max par abuseur | 110 XAF |

---

## 7. Optimisations possibles (futures)

| Optimisation | Economie estimee | Complexite |
|--------------|-----------------|------------|
| Prompt caching Claude (cache reads 0.30$/MTok) | -70% sur le system prompt (~60% de l'input) | Faible |
| Batch API Claude (demi-tarif) | -50% si reponses differees | Moyenne |
| Modele Haiku pour salutations simples | -90% sur les salutations | Faible |
| Reduire contexte RAG de 8 a 5 articles | -10% input | Faible |
| Passer a voyage-3.5 (0.06$/MTok) | -50% sur embeddings | Faible |

### 7.1 Prompt caching (meilleur ROI)

Le system prompt (~3 500 tokens) est identique pour toutes les questions fiscales.
Avec le cache Claude, les lectures en cache coutent 0.30 $/MTok au lieu de 3 $/MTok.

| Sans cache | Avec cache |
|---|---|
| 3 500 x 3$/MTok = 0.0105 $ | 3 500 x 0.30$/MTok = 0.00105 $ |

Economie : **0.009 $/question = ~5.5 XAF/question**

Cout par question apres optimisation : **~16.5 XAF au lieu de 22 XAF**.

### 7.2 Haiku pour les salutations

Les "Bonjour", "Merci", "Au revoir" ne necessitent pas Sonnet.
Haiku 4.5 : 0.80 $/MTok input, 4 $/MTok output.

| | Sonnet | Haiku |
|---|---|---|
| Salutation simple | 22 XAF | ~4 XAF |

---

## 8. Comparatif avec modeles alternatifs

| Modele | Input ($/MTok) | Output ($/MTok) | Cout/question | Qualite fiscale |
|--------|---------------|-----------------|---------------|-----------------|
| Claude Sonnet 4 (actuel) | 3.00 | 15.00 | 22 XAF | Excellente |
| Claude Haiku 4.5 | 0.80 | 4.00 | 6 XAF | Bonne |
| GPT-4o mini | 0.15 | 0.60 | 2 XAF | Moyenne |
| Gemini 2.0 Flash | 0.10 | 0.40 | 1.5 XAF | Moyenne |

Note : les modeles moins chers produisent des reponses fiscales de moindre qualite
(hallucinations sur les numeros d'articles, references incorrectes).
Pour un outil fiscal professionnel, la precision de Sonnet justifie le cout.

---

## 9. Resume

| Indicateur | Valeur |
|---|---|
| Cout par question | 22 XAF (max) |
| Marge brute BASIQUE | 89% |
| Marge brute PRO | 80% |
| Seuil de rentabilite | 4-6 clients |
| Cout acquisition (essai gratuit) | 110 XAF/prospect |
| Cout infra mensuel | ~16 000 XAF |
| Benefice net a 50 clients (mixte) | ~179 000 XAF/mois |
| Benefice net a 100 clients (mixte) | ~370 000 XAF/mois |

**Verdict : rentable des 5 clients, avec des marges de 80-89%. Le prompt caching peut encore reduire les couts de 25%.**

---

## 10. Etat du projet — Existant vs Reste a faire

### 10.1 Backend (server/) — FONCTIONNALITES

| # | Fonctionnalite | Statut | Detail |
|---|---|---|---|
| 1 | Auth (register, login, OTP, reset password, refresh token, logout) | FAIT | Complet, dual-channel web/mobile |
| 2 | MFA / 2FA (TOTP, QR code, codes de secours) | FAIT | AES-256-GCM, 10 backup codes, email notif |
| 3 | Chat IA + Streaming SSE | FAIT | Streaming, citations, historique tronque |
| 4 | RAG (ingestion, embeddings, hybrid search, Qdrant) | FAIT | Voyage AI + Qdrant + recherche hybride 5 etapes |
| 5 | Abonnements (plans, quotas, activation, expiration) | FAIT | FREE/BASIQUE/PRO, activation manuelle, expiry annuelle |
| 6 | Organisations (CRUD, membres, invitations, roles) | FAIT | Soft delete, transfer ownership, invitations tokenisees |
| 7 | Analytics (dashboard, timeseries, stats membres, CSV) | FAIT | 30j courants vs precedents, tendances, export |
| 8 | Audit trail | FAIT | 30+ actions tracees, recherche, stats, cleanup GDPR |
| 9 | Alertes fiscales | FAIT | 50+ alertes predefinies, extraction regex, seed idempotent |
| 10 | Email (OTP, reset, invitation, MFA) | FAIT | Nodemailer SMTP, fallback console en dev |
| 11 | Permissions (17 permissions, 4 roles, overrides) | FAIT | Granulaire par membre, surcharge du role |
| 12 | Rate limiting (global, auth, sensitive) | FAIT | 3 niveaux, adapte prod/dev |
| 13 | Cache in-memory | FAIT | TTL, cleanup auto, 6 prefixes |
| 14 | ArticleReference (references croisees) | FAIT | Extraction auto a l'ingestion + endpoint API |
| 15 | SearchHistory (historique recherches) | FAIT | Fire-and-forget, utilise dans analytics |
| 16 | UsageStats (suivi d'usage) | FAIT | Upsert par jour, dashboard + timeseries |
| 17 | Paiements (Stripe, CinetPay, webhooks) | A FAIRE | Aucun fichier, activation 100% manuelle |
| 18 | Factures PDF (generation, envoi) | A FAIRE | Aucun service, modele Invoice en schema mais non utilise |
| 19 | Emails de rappel (expiration, renouvellement) | A FAIRE | Pas de cron, pas de templates |
| 20 | API d'ingestion exposee (endpoint REST) | A FAIRE | Ingestion uniquement via code, pas de route |

### 10.2 Mobile (mobile/) — ECRANS

| # | Ecran | Statut | Detail |
|---|---|---|---|
| 1 | Login | FAIT | Email + mot de passe |
| 2 | Register | FAIT | Inscription + creation orga |
| 3 | Verify OTP | FAIT | Saisie code email |
| 4 | Forgot / Reset password | FAIT | Flux complet |
| 5 | MFA verify | FAIT | Saisie code TOTP a la connexion |
| 6 | Home | FAIT | Dashboard d'accueil |
| 7 | Chat IA | FAIT | Streaming SSE, conversations |
| 8 | Code CGI (navigation articles) | FAIT | Tomes, chapitres, articles offline |
| 9 | Simulateur IS | FAIT | Calcul avec tests unitaires |
| 10 | Simulateur ITS | FAIT | Bareme + calcul |
| 11 | Simulateur Patente | FAIT | Calcul avec tests |
| 12 | Simulateur Solde de liquidation | FAIT | Calcul avec tests |
| 13 | Profil utilisateur | FAIT | Infos personnelles |
| 14 | Parametres | FAIT | Preferences |
| 15 | Citations / references dans le chat | A FAIRE | Les citations sont renvoyees par l'API mais non affichees |
| 16 | Ecran Organisation / Membres | A FAIRE | Pas d'ecran de gestion d'equipe |
| 17 | Ecran Abonnement / Quota | A FAIRE | Pas de visualisation du plan, quota restant |
| 18 | Ecran Analytics | A FAIRE | Pas de dashboard mobile |
| 19 | Ecran Alertes fiscales | A FAIRE | Pas d'affichage des alertes |
| 20 | Ecran Audit | A FAIRE | Pas de journal d'activite |
| 21 | Ecran References croisees articles | A FAIRE | Endpoint API existe mais non integre |
| 22 | Setup MFA dans le profil | A FAIRE | Activation/desactivation 2FA |
| 23 | Notifications push | A FAIRE | Pas de Firebase/Expo Notifications |

### 10.3 Client Web

| # | Element | Statut | Detail |
|---|---|---|---|
| 1 | Application web complete | A FAIRE | Aucun client web dans le depot |

### 10.4 Infrastructure / DevOps

| # | Element | Statut | Detail |
|---|---|---|---|
| 1 | Docker / docker-compose | A VERIFIER | Non audite |
| 2 | CI/CD (GitHub Actions) | A VERIFIER | Non audite |
| 3 | Redis (cache distribue, rate limiting cluster) | A FAIRE | Tout est in-memory actuellement |
| 4 | Monitoring (health check, metriques) | PARTIEL | /health existe, pas de Prometheus/Grafana |
| 5 | Sentry (error tracking) | PARTIEL | Integre cote mobile, non verifie cote server |
| 6 | Backups BDD automatiques | A VERIFIER | Non audite |

---

## 11. Priorites — Ce qu'il reste a faire

### CRITIQUE (bloquant pour la mise en production)

| # | Tache | Impact | Effort |
|---|---|---|---|
| 1 | Integration paiement CinetPay ou mobile money | Monetisation impossible sans ca | Eleve |
| 2 | Generation de factures PDF | Obligation legale | Moyen |
| 3 | Client web (ou landing page + dashboard admin) | Pas d'interface admin | Eleve |
| 4 | Ecran Abonnement mobile (voir plan, quota restant) | UX critique, l'utilisateur ne sait pas son quota | Faible |

### IMPORTANT (qualite produit)

| # | Tache | Impact | Effort |
|---|---|---|---|
| 5 | Afficher citations/references dans le chat mobile | Credibilite de l'outil fiscal | Faible |
| 6 | Ecran Organisation/Membres mobile | Gestion d'equipe | Moyen |
| 7 | Ecran Alertes fiscales mobile | Valeur ajoutee differenciante | Moyen |
| 8 | Emails de rappel (expiration abonnement, echeances) | Retention clients, renouvellement | Moyen |
| 9 | Notifications push (alertes fiscales, echeances) | Engagement utilisateur | Moyen |
| 10 | Endpoint API d'ingestion (route REST protegee) | Mise a jour CGI sans deploiement | Faible |

### OPTIMISATION (amelioration continue)

| # | Tache | Impact | Effort |
|---|---|---|---|
| 11 | Prompt caching Claude | -25% cout API | Faible |
| 12 | Haiku pour les salutations | -90% cout sur salutations | Faible |
| 13 | Redis (cache + rate limiting distribue) | Scalabilite multi-instance | Moyen |
| 14 | Setup MFA dans le profil mobile | Securite compte | Faible |
| 15 | Ecran Analytics mobile | Suivi utilisation equipe | Moyen |
| 16 | OrganizationId dans UsageStats | Stats analytics par orga correctes | Faible |

---

## 12. Score de completion

| Composant | Fait | Total | Pourcentage |
|---|---|---|---|
| Backend (server) | 16 | 20 | **80%** |
| Mobile (ecrans) | 14 | 23 | **61%** |
| Client web | 0 | 1 | **0%** |
| Infra/DevOps | 1 | 6 | **17%** |
| **Global** | **31** | **50** | **62%** |
