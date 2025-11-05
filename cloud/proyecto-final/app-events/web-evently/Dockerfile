# -------- Etapa 1: build con Node (compila /dist) --------
FROM node:22-alpine AS build
# (comentario) Usamos una imagen ligera de Node 22 para compilar el frontend

WORKDIR /app

# (comentario) Copiamos los manifiestos primero para aprovechar la caché de Docker
COPY package*.json ./

# (comentario) Instalación de dependencias (usa npm ci si hay lockfile; si no, npm install)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# (comentario) Copiamos el resto del código y construimos
COPY . .
# Nota: Vite respetará tu script "build": "vue-tsc -b && vite build"
RUN npm run build

# -------- Etapa 2: runtime con Nginx (sirve /dist) --------
FROM nginx:1.27-alpine
# (comentario) Imagen ligera de Nginx para servir archivos estáticos

# (comentario) Remplazamos la config por una preparada para SPA (history mode)
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# (comentario) Copiamos los artefactos compilados al directorio web de Nginx
COPY --from=build /app/dist/ /usr/share/nginx/html/

# (comentario) Salud del contenedor (opcional, pero útil en orquestadores)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
