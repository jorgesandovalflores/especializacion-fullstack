# ---------- Base con Node + pnpm ----------
FROM node:22-alpine AS base
WORKDIR /app
# No fijes NODE_ENV aquí; déjalo para el runtime
ENV PNPM_HOME=/usr/local/bin
RUN corepack enable && corepack prepare pnpm@9 --activate

# ---------- Dependencias (con dev deps) ----------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# instala también dev deps (aunque el env sea production)
RUN pnpm install --frozen-lockfile --prod=false

# ---------- Build ----------
FROM deps AS build
WORKDIR /app
COPY nest-cli.json tsconfig*.json ./
COPY src ./src
RUN pnpm build

# (Opcional) Prune a prod para runtime
FROM deps AS pruned
WORKDIR /app
RUN pnpm prune --prod

# ---------- Runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=development \
    APPLICATION_MODE=http \
    APPLICATION_PORT=3001 \
    TZ=UTC
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN apk add --no-cache curl netcat-openbsd

# Copiamos node_modules “pruned” y el dist
COPY --from=pruned /app/node_modules ./node_modules
COPY --from=build  /app/dist         ./dist
COPY package.json ./


# Entrypoint pequeño
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && apk add --no-cache curl

USER node
ENTRYPOINT ["/entrypoint.sh"]
