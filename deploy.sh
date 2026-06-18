#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# deploy.sh — Deploy Ploy to the production VPS
#
# Usage:
#   ./deploy.sh user@server-ip
#
# Prerequisites (run once on the VPS):
#   apt update && apt install -y docker.io git
#   systemctl enable --now docker
#   mkdir -p /opt/ploy && scp .env.prod user@server:/opt/ploy/.env.prod
#   chmod 600 /opt/ploy/.env.prod
#
# What this does:
#   1. SSH into the server
#   2. Clone the repo (or pull latest)
#   3. Verify .env.prod exists
#   4. Build and restart containers using docker-compose.prod.yml
# ──────────────────────────────────────────────────────────────────────────────
set -e

SERVER="${1:?Usage: ./deploy.sh user@server-ip}"
APP_DIR="/opt/ploy"
ENV_FILE="$APP_DIR/.env.prod"
COMPOSE_FILE="$APP_DIR/docker-compose.prod.yml"

echo "==> Deploying to $SERVER"

ssh "$SERVER" bash <<EOF
set -e

# ── Pull latest code ─────────────────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "==> Pulling latest code"
  cd "$APP_DIR" && git pull
else
  echo "==> Cloning repo"
  mkdir -p "$APP_DIR"
  git clone https://github.com/Shin-Gi-Hwan/ploy.git "$APP_DIR"
fi

cd "$APP_DIR"

# ── Verify secrets file ───────────────────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  echo ""
  echo "ERROR: $ENV_FILE not found."
  echo ""
  echo "On your local machine, run:"
  echo "  scp .env.prod $SERVER:$ENV_FILE"
  echo "  ssh $SERVER chmod 600 $ENV_FILE"
  echo ""
  echo "Then re-run: ./deploy.sh $SERVER"
  exit 1
fi

# Warn if any placeholder values remain
if grep -q "CHANGE_ME" "$ENV_FILE"; then
  echo ""
  echo "WARNING: .env.prod still contains CHANGE_ME placeholders."
  echo "Fill in all real values before deploying to production."
  echo ""
  read -rp "Continue anyway? (y/N) " confirm
  [ "\$confirm" = "y" ] || exit 1
fi

# ── Build and deploy ──────────────────────────────────────────────────────────
echo "==> Building and starting containers (prod)"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up --build -d

echo "==> Container status"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
EOF

echo ""
SERVER_IP=$(ssh "$SERVER" 'curl -s ifconfig.me 2>/dev/null || hostname -I | awk "{print \$1}"')
echo "Done. App running at http://$SERVER_IP"
