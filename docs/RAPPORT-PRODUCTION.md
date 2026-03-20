# NORMX Tax (CGI-242) — Rapport de mise en production

**Date** : 20 mars 2026
**URL** : https://tax.normx-ai.com
**Repo** : https://github.com/CGI-242/cgi

---

## 1. Infrastructure

| Element | Statut |
|---------|--------|
| Domaine `tax.normx-ai.com` | En production |
| SSL Let's Encrypt | Actif |
| Docker (API + Nginx + PostgreSQL + Qdrant) | Operationnel |
| CI/CD GitHub Actions | Fonctionnel (deploy auto a chaque push) |
| Nginx reverse proxy | Actif, headers securite, CSP |
| VPS | OVH `51.83.75.203` (Ubuntu) |

---

## 2. Donnees CGI 2026

| Element | Statut |
|---------|--------|
| 152 fichiers JSON | Synchronises mobile / server / data |
| Tome 1 (IS, IBA, IRCM, IRF, ITS, Dispositions communes) | Complet |
| Tome 2 (Enregistrement, Timbre, Curatelle) | Complet |
| TFNC 2-5 (Textes non codifies) | Complet |
| TFNC 6 TVA (Chapitres 1-5 + Annexes) | Verifie page par page contre PDF |
| Conventions fiscales (CEMAC, France, Italie, Rwanda, Maurice, Chine) | Complet |
| Mots-cles | Enrichis sur TVA, a completer sur d'autres sections |

---

## 3. Fonctionnalites en production

### 3.1 Code numerique CGI
- Sommaire arborescent (Tome 1, Tome 2, TFNC, Conventions)
- Affichage mode livre (ChapterReader) pour tous les chapitres
- Recherche globale par mots-cles
- Elements abroges grises dans le sommaire (Livre 3, 6, Chapitre 3)
- Titres tronques sur 1 ligne dans le sommaire

### 3.2 Chat IA fiscal (RAG)
- Modele : Claude Sonnet (Anthropic SDK)
- Recherche hybride : Qdrant (vectoriel) + mots-cles
- Streaming SSE des reponses
- Citations avec extraits des articles
- Historique des conversations
- Dictee vocale (Speech Recognition Chrome/Edge)
- Format reponse : "L'article X du Tome N dispose que..." (reference detaillee en fin)

### 3.3 Simulateurs fiscaux (16)
ITS, IS, TVA, Patente, IRCM, IRF, IBA, IGF, Enregistrement, Cession de parts, Contribution fonciere, Paie, Retenue a la source, Taxe immobiliere, Solde de liquidation

### 3.4 Audit Documents
- 5 types : Facture, Releve bancaire, Bon de commande/Contrat, DAS II, Note de frais
- Analyse par Claude (multimodal : PDF + images)
- Verification conformite linguistique (Art. 373 ter)
- Validation taux TVA (Art. 22, Annexes 3 et 5)
- Verification mentions obligatoires (Art. 32)
- Detection SFEC (QR code, NIM, signature DGID)
- Distinction assujetti TVA / forfait (Art. 5, 96)
- Sanctions conformes CGI : 2M FCFA langue, 10K FCFA NIU, 50M FCFA SFEC
- Formats Congo : NIU 16/17 chars, RCCM OHADA, UGE/UME/UPPTE
- Historique des audits en base de donnees

### 3.5 Calendrier fiscal
- Echeances mensuelles
- Notifications (badge + panneau)
- Jours restants avant chaque echeance

### 3.6 Authentification et securite
- Login email + mot de passe
- OTP par email (verification)
- JWT (access + refresh tokens)
- MFA (authentification multi-facteurs)
- Sessions securisees (cookies HttpOnly, SameSite strict)
- Rate limiting (auth, chat, API)
- CORS configure
- Turnstile (CAPTCHA Cloudflare)

### 3.7 Abonnement
- 2 plans : Free (essai 7 jours) + Premium (65 euros/an)
- Quota de questions IA par mois
- Paywall pour les utilisateurs expires

### 3.8 Organisation / Multi-utilisateurs
- Invitations par email
- Roles (Admin, Membre)
- Permissions par module
- Jusqu'a 50 membres par organisation

### 3.9 Interface
- Theme : Light (defaut blanc) / Dark (bleu #1A3A5C)
- Polices : Outfit (corps) + Playfair Display (titres) via Google Fonts
- Header bleu #1A3A5C uniforme (style Normx)
- Sidebar blanche, texte bleu, actif beige/gold (style Normx)
- Barre d'onglets en bas (style Normx)
- i18n : Francais + Anglais
- Responsive : Desktop + Tablette + Mobile
- Calculatrice flottante

---

## 4. Fonctionnalites en attente

### 4.1 Priorite haute

| Fonctionnalite | Detail |
|----------------|--------|
| Paiement en ligne | Pas de provider connecte (Stripe, PayDunya). L'abonnement Premium existe mais pas de tunnel de paiement |
| Reindexation Qdrant | Les donnees TVA corrigees ne sont pas reindexees. Le RAG utilise l'ancien index |
| Push notifications | Le hook existe mais pas configure (Expo Push, FCM) |
| SFEC validation avancee | Detection QR code/NIM basee sur l'absence visuelle, pas de decodage |

### 4.2 Priorite moyenne

| Fonctionnalite | Detail |
|----------------|--------|
| Export PDF audit | Generer un rapport PDF telechargeable du resultat d'audit |
| Tableau de bord analytics | Page existe mais donnees limitees |
| Code Social / Douanier / Hydrocarbures | Affiches comme "Bientot" — donnees non integrees |
| App mobile native | Build Expo sur Google Play existe mais pas a jour |
| Backup PostgreSQL automatique | Pas de cron backup en place |

### 4.3 Priorite basse

| Fonctionnalite | Detail |
|----------------|--------|
| Annotations CGI | Permettre aux utilisateurs d'annoter les articles |
| Comparaison LF 2025 vs 2026 | Mettre en evidence les articles modifies |
| Mode examen/quiz | QCM sur le CGI pour la formation |
| Monitoring/alerting | Pas de Sentry, pas de uptime monitoring |
| Commentaires keyword-mappings | Encore marques "CGI 2025" (cosmetique) |

---

## 5. Points d'attention

- **20 articles texte vide** : articles abroges/sans objet — normal, pas un bug
- **Bundle web 6.5 Mo** : taille elevee mais acceptable pour une SPA avec 152 JSON embarques
- **Certificat SSL** : permissions privkey corrigees (chmod 640), a surveiller au renouvellement
- **Nginx systeme** : desactive, seul Docker nginx tourne
- **Enum SubscriptionPlan** : anciennes valeurs (STARTER, PROFESSIONAL, TEAM, ENTERPRISE) nettoyees

---

## 6. Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Expo (React Native) + expo-router |
| Backend | Node.js / Express / TypeScript |
| Base de donnees | PostgreSQL + Prisma ORM |
| Base vectorielle | Qdrant (RAG) |
| IA | Claude Sonnet (Anthropic SDK) |
| Reverse proxy | Nginx (Docker) |
| CI/CD | GitHub Actions |
| Hebergement | OVH VPS |
| DNS/CDN | Cloudflare |
| Email | OVH SMTP (ssl0.ovh.net:465) |
| CAPTCHA | Cloudflare Turnstile |
