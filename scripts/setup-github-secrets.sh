#!/bin/bash
# ==========================================
# CGI-242 — Configuration des GitHub Secrets
# ==========================================
# Prerequis : gh CLI installe et authentifie
#   brew install gh && gh auth login
#
# Usage :
#   chmod +x scripts/setup-github-secrets.sh
#   ./scripts/setup-github-secrets.sh
# ==========================================

set -e

REPO="CGI-242/cgi"

echo "=========================================="
echo "  CGI-242 — Setup GitHub Secrets"
echo "=========================================="
echo ""
echo "Ce script configure tous les secrets necessaires"
echo "pour le deploiement automatique via GitHub Actions."
echo ""
echo "Repository: $REPO"
echo ""

# --- Verification ---
if ! command -v gh &> /dev/null; then
    echo "ERREUR: gh CLI non installe. Installez-le : brew install gh"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "ERREUR: gh non authentifie. Lancez : gh auth login"
    exit 1
fi

# --- Fonctions ---
set_secret() {
    local name="$1"
    local prompt="$2"
    local current=""

    # Verifier si le secret existe deja
    if gh secret list -R "$REPO" 2>/dev/null | grep -q "^$name"; then
        current=" (deja configure, Enter pour garder)"
    fi

    read -rsp "$prompt$current: " value
    echo ""

    if [ -n "$value" ]; then
        echo "$value" | gh secret set "$name" -R "$REPO"
        echo "  -> $name configure"
    elif [ -n "$current" ]; then
        echo "  -> $name garde (inchange)"
    else
        echo "  -> $name IGNORE (vide)"
    fi
}

generate_secret() {
    local name="$1"
    local prompt="$2"

    read -rp "$prompt [o/N]: " confirm
    if [[ "$confirm" =~ ^[oOyY]$ ]]; then
        value=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")
        echo "$value" | gh secret set "$name" -R "$REPO"
        echo "  -> $name genere et configure"
        echo "  -> Valeur: $value"
        echo "     (notez-la si vous en avez besoin ailleurs)"
    else
        set_secret "$name" "  Entrez la valeur pour $name"
    fi
}

# --- 1. Cle SSH du VPS ---
echo ""
echo "--- 1/5 : Acces VPS ---"
echo "Collez votre cle SSH privee (celle qui accede au VPS),"
echo "puis appuyez sur Ctrl+D :"
gh secret set VPS_SSH_KEY -R "$REPO"
echo "  -> VPS_SSH_KEY configure"

# --- 2. Base de donnees ---
echo ""
echo "--- 2/5 : Base de donnees ---"
set_secret "DATABASE_URL" "  DATABASE_URL (postgresql://user:pass@postgres:5432/cgi242?schema=public)"
set_secret "POSTGRES_PASSWORD" "  POSTGRES_PASSWORD (mot de passe PostgreSQL Docker)"

# --- 3. Secrets applicatifs ---
echo ""
echo "--- 3/5 : Secrets applicatifs ---"
generate_secret "JWT_SECRET" "  Generer un nouveau JWT_SECRET ?"
generate_secret "JWT_REFRESH_SECRET" "  Generer un nouveau JWT_REFRESH_SECRET ?"
generate_secret "MFA_ENCRYPTION_KEY" "  Generer une nouvelle MFA_ENCRYPTION_KEY ?"

# --- 4. API externes ---
echo ""
echo "--- 4/5 : Cles API externes ---"
set_secret "ANTHROPIC_API_KEY" "  ANTHROPIC_API_KEY (sk-ant-...)"
set_secret "VOYAGE_API_KEY" "  VOYAGE_API_KEY (pa-...)"
set_secret "TURNSTILE_SECRET_KEY" "  TURNSTILE_SECRET_KEY (0x4A...)"
set_secret "TURNSTILE_SITE_KEY" "  TURNSTILE_SITE_KEY (cle publique)"
set_secret "SENTRY_DSN" "  SENTRY_DSN (https://...@sentry.io/...)"

# --- 5. SMTP ---
echo ""
echo "--- 5/5 : Email SMTP ---"
set_secret "SMTP_HOST" "  SMTP_HOST (ex: ssl0.ovh.net)"
set_secret "SMTP_USER" "  SMTP_USER (ex: no-reply@normx-ai.com)"
set_secret "SMTP_PASS" "  SMTP_PASS"
set_secret "ADMIN_EMAIL" "  ADMIN_EMAIL (ex: contact@cgi242.com)"

# --- Resume ---
echo ""
echo "=========================================="
echo "  Configuration terminee !"
echo "=========================================="
echo ""
echo "  Secrets configures dans $REPO :"
gh secret list -R "$REPO" 2>/dev/null || echo "  (impossible de lister)"
echo ""
echo "  Prochaine etape :"
echo "    git push origin main"
echo "  Le workflow .github/workflows/deploy.yml se declenchera automatiquement."
echo ""
