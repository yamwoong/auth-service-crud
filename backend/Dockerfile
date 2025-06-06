# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copy package, lockfile, tsconfig
COPY package*.json tsconfig.json ./

# 2) Install dependencies
RUN npm install

# 3) Copy source
COPY . .

# 3.5) 빌드 시 메모리 한계(힙)를 4GB로 늘려 OOM 방지
ENV NODE_OPTIONS="--max_old_space_size=4096"

# 4) Build
RUN npm run build

# --- Final stage ---
FROM node:20-alpine AS final
WORKDIR /app

# 1) Copy built output and modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 1.5) Copy swagger spec
COPY --from=builder /app/swagger.yaml ./

# 2) Flatten dist/src into dist for flat structure
RUN mv dist/src/* dist/ && rm -rf dist/src

# 3) Production mode
ENV NODE_ENV=production

# 4) Run
CMD ["node", "-r", "module-alias/register", "dist/server.js"]
