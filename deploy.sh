#!/usr/bin/env bash
set -euo pipefail

# ====== 설정 값 ======
REPO_DIR=~/auth-service
REPO_URL=git@github.com:yamwoong/auth-service-crud.git
BRANCH=main
# ====================

echo ">>> Deploying $REPO_URL ($BRANCH) to $REPO_DIR"

# ——— 0) Docker / docker-compose 설치 확인 & 자동 설치 ———
if ! command -v docker &> /dev/null; then
  echo ">>> Docker not found, installing…"

  if command -v apt-get &> /dev/null; then
    # Ubuntu / Debian 계열
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose

  elif command -v yum &> /dev/null; then
    # Amazon Linux / CentOS 계열
    sudo yum update -y

    # Amazon Linux Extras로 Docker 설치 시도, 없으면 yum으로 fallback
    sudo amazon-linux-extras install -y docker || sudo yum install -y docker

    # docker-compose 바이너리 설치
    DOCKER_COMPOSE_VERSION="1.29.2"
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

  else
    echo "Unsupported package manager; please install Docker manually."
    exit 1
  fi

  # Docker 서비스 시작 및 권한 설정
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  echo ">>> Docker installation complete."
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
