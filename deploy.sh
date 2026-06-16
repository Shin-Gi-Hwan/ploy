#!/bin/bash
# Usage: ./deploy.sh user@server-ip
# Run from your local machine. Requires git, docker, docker compose on the server.
#
# First-time server setup (run once on the VPS):
#   apt update && apt install -y docker.io git
#   systemctl enable --now docker
#
set -e

SERVER="${1:?Usage: ./deploy.sh user@server-ip}"
APP_DIR="/opt/ploy"

echo "==> Deploying to $SERVER"

ssh "$SERVER" bash <<EOF
set -e

# Clone or pull
if [ -d "$APP_DIR/.git" ]; then
  echo "==> Pulling latest code"
  cd "$APP_DIR" && git pull
else
  echo "==> Cloning repo"
  mkdir -p "$APP_DIR"
  git clone https://github.com/Shin-Gi-Hwan/ploy.git "$APP_DIR"
fi

# Require .env
if [ ! -f "$APP_DIR/.env" ]; then
  echo ""
  echo "ERROR: $APP_DIR/.env not found."
  echo "Create it from .env.production.example and fill in real values, then re-run."
  exit 1
fi

cd "$APP_DIR"

echo "==> Building and starting containers"
docker compose up --build -d

echo "==> Status"
docker compose ps
EOF

echo ""
echo "Done. Access the app at http://$(ssh "$SERVER" 'curl -s ifconfig.me 2>/dev/null || hostname -I | awk "{print \$1}"')"
