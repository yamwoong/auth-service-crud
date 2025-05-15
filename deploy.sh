#!/usr/bin/env bash
set -euo pipefail

# ====== 설정 값 ======
REPO_DIR=~/auth-service
REPO_URL=https://github.com/yamwoong/auth-service-crud.git
BRANCH=main
# ====================

echo ">>> Deploying $REPO_URL ($BRANCH) to $REPO_DIR"

# ——— 0) 필수 툴 설치 확인 & 자동 설치 ———
if ! command -v git &> /dev/null || ! command -v docker &> /dev/null; then
  echo ">>> Required tools missing. Installing…"
  if command -v apt-get &> /dev/null; then
    # Debian/Ubuntu 계열
    sudo apt-get update
    sudo apt-get install -y git docker.io docker-compose

  elif command -v yum &> /dev/null; then
    # Amazon Linux / CentOS 계열
    sudo yum update -y
    sudo yum install -y git

    # Docker 설치
    sudo amazon-linux-extras install -y docker || sudo yum install -y docker

    # docker-compose(파이썬 번들)에서 libcrypt.so.1을 찾지 못하는 문제 해결용 패키지
    sudo yum install -y libxcrypt-compat

    # docker-compose 바이너리 설치
    DOCKER_COMPOSE_VERSION="1.29.2"
    sudo curl -L \
      "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

  else
    echo "Unsupported package manager; please install git & Docker manually."
    exit 1
  fi

  # Docker 서비스 기동 및 권한 설정
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  echo ">>> Installation of git & Docker complete."
fi

# 이하 기존 로직...
