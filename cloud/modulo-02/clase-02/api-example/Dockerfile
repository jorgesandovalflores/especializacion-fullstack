# ---------- Etapa 1: dependencias + build (dev) ----------
FROM node:22-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiamos manifiestos primero para aprovechar la cache de Docker
# (Usa npm ci si existe package-lock.json; si no, cae a npm install)
# --ignore-scripts evita ejecuciones inseguras en instalación
COPY package*.json ./
RUN npm ci --ignore-scripts || npm install --no-audit --no-fund

# Copiamos configuración y código fuente
# (Si no tienes nest-cli.json/tsconfig.paths.json, no pasa nada)
COPY tsconfig*.json nest-cli.json* ./
COPY src ./src

# Compilamos a /app/dist
# (Requiere que "build": "nest build" funcione localmente)
RUN npm run build


# ---------- Etapa 2: instalar dependencias de runtime (sin dev) ----------
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
# Instalamos solo dependencias de producción
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev --no-audit --no-fund


# ---------- Etapa 3: imagen final mínima ----------
FROM node:22-alpine AS runner

# Variables de entorno para producción
ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Copiamos node_modules de prod y el build compilado
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder   /app/dist         ./dist
COPY package*.json ./

# Por seguridad, ejecutamos como usuario no root
USER node

# Puerto por defecto (Nest suele usar 3000)
EXPOSE 3000

# Comando de inicio en producción
CMD ["node", "dist/main.js"]
