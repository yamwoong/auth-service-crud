# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 0) Copy production environment (so Vite can pick up import.meta.env.*)
COPY .env.production ./

# 1) Copy package metadata & install deps
COPY package*.json ./
RUN npm install

# 2) Copy source & build
COPY . .
RUN npm run build

# --- Production stage ---
FROM nginx:alpine

# 1) Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# 2) Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3) Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
