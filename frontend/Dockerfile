# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
RUN npm run build

# --- Production stage ---
FROM nginx:alpine
# 1) 기본 conf 제거
RUN rm /etc/nginx/conf.d/default.conf
# 2) 커스텀 conf 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 3) 빌드 결과물을 Nginx doc root에 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
