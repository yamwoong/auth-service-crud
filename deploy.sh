#!/usr/bin/env bash
set -euo pipefail

# ====== 설정 값 ======
REPO_DIR=~/auth-service
REPO_URL=git@github.com:yamwoong/auth-service-crud.git
BRANCH=main
# ====================

echo ">>> Deploying $REPO_URL ($BRANCH) to $REPO_DIR"

# ——— 0) 필수 툴 설치 확인 & 자동 설치 ———
#   docker, docker-compose, git
if ! command -v git &> /dev/null || ! command -v docker &> /dev/null; then
  echo ">>> Required tools missing. Installing…"
  if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y git docker.io docker-compose
  elif command -v yum &> /dev/null; then
    sudo yum update -y
    # git
    sudo yum install -y git
    # docker
    sudo amazon-linux-extras install -y docker || sudo yum install -y docker
    DOCKER_COMPOSE_VERSION="1.29.2"
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  else
    echo "Unsupported package manager; please install git & Docker manually."
    exit 1
  fi

  # Docker 서비스 기동 및 권한 부여
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  echo ">>> Installation of git & Docker complete."
fi

# ——— 1) 배포 디렉토리 생성 ———
mkdir -p "$REPO_DIR"

# ——— 2) 클론 또는 업데이트 ———
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Cloning repository…"
  git clone -b "$BRANCH" "$REPO_URL" "$REPO_DIR"
else
  echo "Updating existing repo…"
  cd "$REPO_DIR"
  git fetch origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

# ——— 3) 워킹 디렉토리로 이동 ———
cd "$REPO_DIR"

# ——— 4) Docker Compose 재시작 ———
echo "Pulling new images…"
docker-compose pull

echo "Starting containers…"
docker-compose up -d --remove-orphans

echo ">>> Deployment complete!"
