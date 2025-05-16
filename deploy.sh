#!/usr/bin/env bash
set -euo pipefail

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
