#!/usr/bin/env bash
set -euo pipefail

# ====== 설정 값 ======
REPO_DIR=~/auth-service
REPO_URL=git@github.com:yamwoong/auth-service-crud.git
BRANCH=main
# ====================

echo ">>> Deploying $REPO_URL ($BRANCH) to $REPO_DIR"

# 0) 디렉토리 생성 (없으면)
mkdir -p "$REPO_DIR"

# 1) 클론 또는 업데이트
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Cloning repository..."
  git clone -b "$BRANCH" "$REPO_URL" "$REPO_DIR"
else
  echo "Updating existing repo..."
  cd "$REPO_DIR"
  git fetch origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

# 2) 디렉터리 이동 (클론/업데이트 후)
cd "$REPO_DIR"

# 3) Docker Compose로 컨테이너 재시작
echo "Pulling new images..."
docker-compose pull

echo "Starting containers..."
docker-compose up -d --remove-orphans

echo ">>> Deployment complete!"
