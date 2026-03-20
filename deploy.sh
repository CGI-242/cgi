#!/bin/bash
# ==========================================
# CGI-242 — Script de déploiement VPS OVH
# ==========================================
# Usage: ssh ubuntu@51.83.75.203 'bash -s' < deploy.sh
# ==========================================

set -e

APP_DIR="/opt/cgi242"
REPO_URL="https://github.com/CGI-242/cgi.git"
DOMAIN="tax.normx-ai.com"

echo "=========================================="
echo "  CGI-242 — Déploiement Production"
echo "=========================================="

# --- 1. Mise à jour système ---
echo "[1/7] Mise à jour système..."
sudo apt update && sudo apt upgrade -y

# --- 2. Installation Docker ---
echo "[2/7] Installation Docker..."
if ! command -v docker &> /dev/null; then
    # B13 : installation Docker via le dépôt APT officiel (plus sûr que curl|sh)
    sudo apt install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "Docker installé. Reconnectez-vous pour appliquer les permissions."
fi
sudo systemctl enable docker
sudo systemctl start docker

# Installation docker compose plugin
if ! docker compose version &> /dev/null; then
    sudo apt install -y docker-compose-plugin
fi

# --- 3. Cloner le dépôt ---
echo "[3/7] Clonage du dépôt..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR && git pull origin main
else
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# --- 4. Configuration ---
echo "[4/7] Configuration..."
if [ ! -f "$APP_DIR/server/.env.production" ]; then
    echo "ERREUR: Créez d'abord $APP_DIR/server/.env.production"
    echo "Copiez le template et remplissez les valeurs :"
    echo "  cp server/.env.production.example server/.env.production"
    echo "  nano server/.env.production"
    exit 1
fi

# Générer le mot de passe PostgreSQL s'il n'existe pas
if [ ! -f "$APP_DIR/.env" ]; then
    PG_PASS=$(openssl rand -base64 32 | tr -d '=/+')
    echo "POSTGRES_PASSWORD=$PG_PASS" > "$APP_DIR/.env"
    echo "Mot de passe PostgreSQL généré."
fi

# --- 5. Build et démarrage ---
echo "[5/7] Build et démarrage des services..."
cd $APP_DIR
docker compose build --no-cache api
docker compose up -d

# Attendre que PostgreSQL soit prêt
echo "Attente PostgreSQL..."
sleep 10

# --- 6. Certificat SSL ---
echo "[6/7] Certificat SSL..."
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "Obtention du certificat SSL pour $DOMAIN..."
    docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        -d $DOMAIN \
        --email contact@normx-ai.com \
        --agree-tos \
        --non-interactive

    # Activer HTTPS dans Nginx
    # Décommenter la config HTTPS et commenter HTTP
    echo "Certificat obtenu ! Activez HTTPS dans nginx/conf.d/api.conf"
    echo "Puis : docker compose restart nginx"
fi

# --- 7. Vérification ---
echo "[7/7] Vérification..."
echo ""
docker compose ps
echo ""
echo "=========================================="
echo "  Déploiement terminé !"
echo "=========================================="
echo ""
echo "  API:      http://$DOMAIN/api"
echo "  Health:   http://$DOMAIN/health"
echo "  Swagger:  http://$DOMAIN/api/docs"
echo ""
echo "  Commandes utiles :"
echo "    docker compose logs -f api    # Logs backend"
echo "    docker compose logs -f postgres  # Logs DB"
echo "    docker compose restart        # Redémarrer"
echo "    docker compose down           # Arrêter"
echo ""
