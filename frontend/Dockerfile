# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Declare build args for environment variables
ARG VITE_API_BASE_URL
ARG VITE_FRONTEND_URL

# 2) Set as ENV for Vite to inline at build time
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

# 3) Install dependencies
COPY package*.json ./
RUN npm install

# 4) Copy source & build
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
