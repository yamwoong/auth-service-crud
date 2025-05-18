#!/usr/bin/env bash
set -euo pipefail

# === 0) development Env 파일 자동 생성 ===
cat > "$HOME/auth-service/backend/.env.development" <<EOF
NODE_ENV=${NODE_ENV}
PORT=${PORT}
MONGODB_URI=${MONGODB_URI}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN}
REDIS_URL=${REDIS_URL}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GOOGLE_CALLBACK_URL=${GOOGLE_CALLBACK_URL}
FRONTEND_URL=${FRONTEND_URL}
GMAIL_CLIENT_ID=${GMAIL_CLIENT_ID}
GMAIL_CLIENT_SECRET=${GMAIL_CLIENT_SECRET}
GMAIL_REFRESH_TOKEN=${GMAIL_REFRESH_TOKEN}
GMAIL_USER=${GMAIL_USER}
RESET_PASSWORD_URL=${RESET_PASSWORD_URL}
EOF

# === Configuration ===
readonly REPO_DIR="$HOME/auth-service"
readonly REPO_URL="https://github.com/yamwoong/auth-service-crud.git"
readonly BRANCH="main"

log() {
  echo "[Deploy] $1"
}

# Update or clone repository
if [[ -d "$REPO_DIR/.git" ]]; then
  log "Updating existing repository..."
  git -C "$REPO_DIR" fetch origin "$BRANCH"
  git -C "$REPO_DIR" reset --hard "origin/$BRANCH"
else
  log "Cloning repository..."
  git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
fi

# Deploy via Docker Compose
log "Entering $REPO_DIR"
pushd "$REPO_DIR" >/dev/null

log "Pulling latest images..."
docker-compose pull

log "Restarting containers..."
docker-compose up -d --remove-orphans

popd >/dev/null
log "Deployment complete!"
