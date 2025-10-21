# Multi-stage build
FROM node:18-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN pnpm build

# Stage de producción
FROM node:18-alpine

# Instalar pnpm y curl para healthcheck
RUN npm install -g pnpm && \
    apk add --no-cache curl

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml* ./

# Instalar solo production dependencies
RUN pnpm install --prod

# Copiar aplicación compilada
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Crear directorio para logs y dar permisos
RUN mkdir -p /app/logs && \
    chown -R nestjs:nodejs /app

USER nestjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Script de entrada que maneja variables
COPY --chown=nestjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]