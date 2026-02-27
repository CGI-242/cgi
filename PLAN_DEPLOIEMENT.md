# PLAN DE DÉPLOIEMENT — CGI-242

> **Date :** 27 février 2026
> **VPS :** VPS VLE-4 OVH — `vps-18bd822a.vps.ovh.net`
> **IP :** `51.83.75.203` | **IPv6 :** `2001:41d0:304:200::a1b6`
> **Domaine :** `cgi242.normx-ai.com` (SSL Let's Encrypt actif)
> **Connexion :** `ssh ubuntu@51.83.75.203`
> **Localisation :** Gravelines, France

---

## 1. SPECS VPS

| Élément | Valeur |
|---------|--------|
| Modèle | VPS VLE-4 |
| CPU | 4 vCPU AMD EPYC |
| RAM | 4 Go |
| Stockage | 80 Go SSD NVMe |
| OS | Ubuntu 24.10 |
| Kernel | 6.8.0-86-generic |
| Localisation | Gravelines, France |

## 2. ÉTAT ACTUEL DU VPS (après nettoyage)

| Ressource | Valeur |
|-----------|--------|
| Disque | 77 Go — **11 Go utilisé (14%)** |
| Docker | **0 conteneur, 0 image, 0 volume** |
| Nginx | Installé, SSL Let's Encrypt actif |
| Certbot | Configuré (auto-renouvellement) |
| Sites Nginx | cgi242.normx-ai.com (à mettre à jour) |
| Anciens projets | **Tous supprimés** (NormX, Paie, Keycloak) |

---

## 3. ARCHITECTURE CIBLE

```
Internet (HTTPS)
       │
       ▼
┌─────────────────────────────────────┐
│  Nginx (reverse proxy + SSL)        │
│  cgi242.normx-ai.com :443          │
│                                     │
│  /api/*      → localhost:3004       │
│  /api/docs   → localhost:3004       │
│  /health     → localhost:3004       │
│  /*          → fichiers statiques   │
└─────────┬───────────────────────────┘
          │
    ┌─────▼──────┐
    │  Express    │  Port 3004 (Docker)
    │  API REST   │  78 endpoints
    │  SSE Chat   │  Claude Sonnet 4
    │  Swagger UI │  /api/docs
    └──┬──────┬───┘
       │      │
  ┌────▼┐  ┌──▼──────┐
  │ PG  │  │ Qdrant   │
  │5432 │  │ 6333     │
  └─────┘  └──────────┘

3 conteneurs Docker :
  - cgi-242-server (Express + frontend Expo)
  - cgi-242-db (PostgreSQL 17)
  - cgi-242-qdrant (base vectorielle)
```

---

## 4. ACTIONS PRÉ-DÉPLOIEMENT (machine locale)

### 4.1 Vérifier compilation TypeScript

```bash
cd ~/cgi-242/server && npx tsc --noEmit    # ✅ 0 erreurs
cd ~/cgi-242/mobile && npx tsc --noEmit    # ✅ 0 erreurs
```

### 4.2 Lancer les tests

```bash
cd ~/cgi-242/server && npm test            # ✅ 19/19 passants
```

### 4.3 Builder le frontend Expo Web

```bash
cd ~/cgi-242/mobile && npx expo export --platform web
```
> Produit `mobile/dist/` (index.html + assets JS/CSS)

### 4.4 Créer le Dockerfile serveur

Fichier `server/Dockerfile` :

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3004
CMD ["node", "dist/server.js"]
```

### 4.5 Créer docker-compose.prod.yml

Fichier `docker-compose.prod.yml` (racine du projet) :

```yaml
services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: cgi-242-server
    restart: unless-stopped
    ports:
      - "127.0.0.1:3004:3004"
    env_file:
      - ./server/.env.production
    volumes:
      - ./mobile/dist:/app/mobile-dist:ro
      - server_logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3004/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:17-alpine
    container_name: cgi-242-db
    restart: unless-stopped
    ports:
      - "127.0.0.1:5432:5432"
    environment:
      POSTGRES_DB: cgi242
      POSTGRES_USER: cgi242
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cgi242"]
      interval: 10s
      timeout: 5s
      retries: 5

  qdrant:
    image: qdrant/qdrant:latest
    container_name: cgi-242-qdrant
    restart: unless-stopped
    ports:
      - "127.0.0.1:6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  postgres_data:
  qdrant_data:
  server_logs:
```

### 4.6 Créer .env.production

Fichier `server/.env.production` :

```env
NODE_ENV=production
PORT=3004

# PostgreSQL (conteneur Docker)
DATABASE_URL="postgresql://cgi242:MOT_DE_PASSE_FORT@postgres:5432/cgi242?schema=public"

# JWT (secrets générés aléatoirement)
JWT_SECRET=<node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))">
JWT_REFRESH_SECRET=<même commande>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Claude API
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE

# URLs production
FRONTEND_URL=https://cgi242.normx-ai.com
CORS_ORIGIN=https://cgi242.normx-ai.com

# Qdrant (conteneur Docker)
QDRANT_URL=http://qdrant:6333

# Voyage AI (embeddings)
VOYAGE_API_KEY=YOUR_VOYAGE_API_KEY_HERE

# Admin
ADMIN_EMAIL=contact@cgi242.com
```

### 4.7 Adapter le chemin frontend dans app.ts

```typescript
const webDistPath = process.env.NODE_ENV === "production"
  ? path.resolve(__dirname, "../mobile-dist")
  : path.resolve(__dirname, "../../mobile/dist");
```

---

## 5. DÉPLOIEMENT (sur le VPS)

### Étape 1 — Transférer le projet

```bash
# Depuis la machine locale
cd ~/cgi-242

# Créer le dossier sur le VPS
ssh ubuntu@51.83.75.203 "sudo mkdir -p /opt/cgi-242 && sudo chown ubuntu:ubuntu /opt/cgi-242"

# Envoyer le code serveur
rsync -avz --exclude node_modules --exclude .env --exclude dist \
  server/ ubuntu@51.83.75.203:/opt/cgi-242/server/

# Envoyer le frontend buildé
rsync -avz mobile/dist/ ubuntu@51.83.75.203:/opt/cgi-242/mobile/dist/

# Envoyer docker-compose + .env production
scp docker-compose.prod.yml ubuntu@51.83.75.203:/opt/cgi-242/
scp server/.env.production ubuntu@51.83.75.203:/opt/cgi-242/server/.env.production

# Envoyer le .env Docker (mot de passe BDD)
echo "DB_PASSWORD=cgi242-prod-$(openssl rand -hex 16)" > /tmp/.env.docker
scp /tmp/.env.docker ubuntu@51.83.75.203:/opt/cgi-242/.env
rm /tmp/.env.docker
```

### Étape 2 — Builder et lancer

```bash
ssh ubuntu@51.83.75.203
cd /opt/cgi-242

# Lancer les 3 conteneurs
docker compose -f docker-compose.prod.yml up -d --build

# Attendre que PostgreSQL soit prêt
sleep 10

# Appliquer les migrations Prisma
docker exec cgi-242-server npx prisma migrate deploy

# Vérifier
docker compose -f docker-compose.prod.yml ps
curl -s http://localhost:3004/health
```

### Étape 3 — Configurer Nginx

```bash
sudo tee /etc/nginx/sites-enabled/cgi242.normx-ai.com > /dev/null << 'NGINX'
# CGI-242 — cgi242.normx-ai.com
server {
    server_name cgi242.normx-ai.com;

    # API proxy (Express sur port 3004)
    location /api {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Frontend SPA (Expo Web)
    root /opt/cgi-242/mobile/dist;
    index index.html;

    location = /index.html {
        add_header Cache-Control 'no-store, no-cache, must-revalidate, max-age=0';
        try_files $uri =404;
    }

    location ~* \.(js|css|woff2?|ttf|ico|webp|png|jpg|svg)$ {
        add_header Cache-Control 'public, max-age=31536000, immutable';
        try_files $uri =404;
    }

    location / {
        add_header Cache-Control 'no-store, no-cache, must-revalidate, max-age=0';
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/cgi242.normx-ai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cgi242.normx-ai.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name cgi242.normx-ai.com;
    return 301 https://$host$request_uri;
}
NGINX

# Tester et recharger
sudo nginx -t && sudo systemctl reload nginx
```

### Étape 4 — Ingérer les articles CGI

```bash
docker exec cgi-242-server node dist/scripts/ingest-articles.js
```

### Étape 5 — Vérification finale

```bash
# Health check complet
curl -s https://cgi242.normx-ai.com/health | python3 -m json.tool

# Swagger UI
curl -s -o /dev/null -w "%{http_code}" https://cgi242.normx-ai.com/api/docs

# Frontend
curl -s -o /dev/null -w "%{http_code}" https://cgi242.normx-ai.com/

# API auth
curl -s -X POST https://cgi242.normx-ai.com/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# Logs
docker logs cgi-242-server --tail 20
```

---

## 6. CHECKLIST

### Pré-déploiement (machine locale)

| # | Action | État |
|---|--------|------|
| 1 | TypeScript serveur 0 erreurs | ✅ Fait |
| 2 | TypeScript mobile 0 erreurs | ✅ Fait |
| 3 | 19/19 tests passants | ✅ Fait |
| 4 | Frontend buildé (`npx expo export --platform web`) | ⬜ À faire |
| 5 | `server/Dockerfile` créé | ⬜ À faire |
| 6 | `docker-compose.prod.yml` créé | ⬜ À faire |
| 7 | `.env.production` avec vrais secrets | ⬜ À faire |
| 8 | Chemin frontend prod dans `app.ts` | ⬜ À faire |

### Déploiement (VPS)

| # | Action | État |
|---|--------|------|
| 9 | VPS nettoyé (0 conteneur) | ✅ Fait |
| 10 | Fichiers transférés (rsync) | ⬜ À faire |
| 11 | `docker compose up -d --build` | ⬜ À faire |
| 12 | Migrations Prisma appliquées | ⬜ À faire |
| 13 | Nginx mis à jour (port 3004) | ⬜ À faire |
| 14 | Articles CGI ingérés dans Qdrant | ⬜ À faire |
| 15 | Health check HTTPS OK | ⬜ À faire |
| 16 | Swagger UI accessible | ⬜ À faire |
| 17 | Frontend chargé | ⬜ À faire |

---

## 7. ESTIMATION MÉMOIRE

| Service | RAM |
|---------|-----|
| Express (Node.js) | ~200 Mo |
| PostgreSQL 17 | ~300 Mo |
| Qdrant | ~500 Mo |
| Nginx | ~20 Mo |
| OS Ubuntu | ~400 Mo |
| **Total** | **~1.4 Go / 4 Go** |
| **Disponible** | **~2.6 Go** |

---

## 8. COMMANDES UTILES POST-DÉPLOIEMENT

| Action | Commande |
|--------|----------|
| Voir les logs | `docker logs -f cgi-242-server` |
| Redémarrer | `cd /opt/cgi-242 && docker compose -f docker-compose.prod.yml restart` |
| Mettre à jour | `rsync` local → VPS, puis `docker compose up -d --build` |
| Backup BDD | `docker exec cgi-242-db pg_dump -U cgi242 cgi242 > backup_$(date +%Y%m%d).sql` |
| Restaurer BDD | `cat backup.sql \| docker exec -i cgi-242-db psql -U cgi242 cgi242` |
| Ingestion articles | `docker exec cgi-242-server node dist/scripts/ingest-articles.js` |
| Certificat SSL | `sudo certbot renew --dry-run` |
| État Docker | `docker compose -f docker-compose.prod.yml ps` |
| Espace disque | `df -h / && docker system df` |

---

## 9. ROLLBACK

```bash
ssh ubuntu@51.83.75.203
cd /opt/cgi-242
docker compose -f docker-compose.prod.yml down
# Les données PostgreSQL et Qdrant sont persistées dans les volumes Docker
# Relancer : docker compose -f docker-compose.prod.yml up -d
```

---

*Plan mis à jour le 27 février 2026 — VPS OVH VLE-4 Gravelines — Projet CGI-242*
