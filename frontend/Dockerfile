# ============================================
# Stage 1: Build do Angular
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .
RUN npm run build -- --configuration production

# ============================================
# Stage 2: Nginx para servir o app
# ============================================
FROM nginx:1.27-alpine

# Remove configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
