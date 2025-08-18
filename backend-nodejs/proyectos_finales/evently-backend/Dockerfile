# =============================================
# Dockerfile para aplicación Node.js (TypeScript)
# =============================================

# ---------- Argumentos de construcción ----------
ARG APP_VERSION=latest
ARG BUILD_DATE=unknown

# ---------- Stage Única (Optimizada) ----------
FROM node:22-alpine

# 1. Actualización del sistema y configuración inicial
RUN apk update && apk upgrade --no-cache
WORKDIR /app

# 2. Instalación de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# 3. Configuración de entorno seguro
RUN corepack enable && \
    pnpm install --frozen-lockfile && \
    pnpm store prune && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# 4. Copia del código fuente
COPY src ./src

# 5. Inyección de metadatos de versión
RUN echo "APP_VERSION=${APP_VERSION}" > .env.version && \
    echo "BUILD_DATE=${BUILD_DATE}" >> .env.version

# 6. Compilación y preparación para producción
RUN pnpm run build && \
    pnpm prune --production && \
    rm -rf /var/cache/apk/*

# 7. Configuración de runtime
USER appuser
ENV NODE_ENV=production PORT=3000
EXPOSE 3000

# 8. Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" || exit 1

# 9. Punto de entrada
CMD ["node", "dist/main.js"]

# 10. Metadatos (usando los ARGs correctamente)
LABEL org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}"