# App evently — Infra

## Este directorio contiene los contenedores configurados necesarios para poder aproveer y deployar las aplicaciones de evently

## Paso 0) Instalación de Docker y Docker Compose

Antes de continuar, asegúrate de tener instalados **Docker Engine** y **Docker Compose v2** en tu máquina:

### Windows

1. Descarga e instala **Docker Desktop** desde: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Verifica la instalación en PowerShell o CMD:
    ```bash
    docker --version
    docker compose version
    ```

### Linux (Ubuntu/Debian como ejemplo)

1. Instala Docker:
    ```bash
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg]    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    ```
2. Verifica la instalación:
    ```bash
    docker --version
    docker compose version
    ```

### macOS

1. Descarga e instala **Docker Desktop para Mac** desde: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)  
   (Soporta tanto Intel como Apple Silicon).
2. Verifica la instalación en la terminal:
    ```bash
    docker --version
    docker compose version
    ```

---

## Estructura del directorio

```
infra
├── docker-compose.mysql.yml   # Servicio Mysql (development)
├── docker-compose.redis.yml   # Servicio Redis (development)
```

---

## Requisitos

-   Docker Engine **20.10+** (o superior)
-   Docker Compose **v2** (plugin oficial de Docker)
-   Red externa compartida (p. ej. `network-app-evently`) para vincular servicios entre archivos Compose

---

## Variables de entorno

Ejemplo **.env** (recortado a lo esencial para infra). Adecúa nombres/credenciales a tu entorno:

```env
PROJECT_NAME="app-evently"
NETWORK="network-app-evently"
TZ="America/Lima"
BACKEND_IMAGE="http-app-evently"
BACKEND_TAG="0.0.1"
WEB_IMAGE="web-app-evently"
WEB_TAG="0.0.1"

# Mysql
MYSQL_CONTAINER_NAME="mysql-app-evently"
MYSQL_ROOT_PASSWORD="root"
MYSQL_DATABASE="db_app_evently"
MYSQL_VOLUME="evently_mysql_volume"

# Redis
REDIS_CONTAINER_NAME="redis-app-evently"
REDIS_PORT="6379"
REDIS_VOLUME="evently_redis_volume"
REDIS_DB="0"
REDIS_PASSWORD=""

# Http
HTTP_CONTAINER_NAME="http-app-evently"
HTTP_DOCKER_PLATFORM="linux/amd64"
HTTP_NODE_ENV="development"
HTTP_NODE_DEBUG="false"
HTTP_APP_PORT="3001"
HHPT_DB_POOL="5"
HTTP_GLOBAL_PREFIX="/api"
HTTP_DB_LOGGING="true"
HTTP_DB_SYNCHRONIZE="false"
HTTP_JWT_ACCESS_SECRET="!Evently@access"
HTTP_JWT_ACCESS_TTL="12h"
HTTP_JWT_REFRESH_SECRET="!Evently@refresh"
HTTP_JWT_REFRESH_TTL="7d"
HTTP_SWAGGER_TITLE="Evently API"
HTTP_SWAGGER_DESC="Backend para gestión de eventos (Evently)"
HTTP_SWAGGER_VERSION="1.0.0"

# Web
WEB_CONTAINER_NAME="web-app-evently"
WEB_DOCKER_PLATFORM="linux/amd64"
WEB_VITE_API_BASE_URL="http://http-app-evently:3001/api"
WEB_VITE_WS_HOST="http://http-app-evently:3001"
WEB_APP_PORT="3000"

```

---

## Red compartida (una sola vez)

Crea la red externa (si no existe). Todas las composiciones la referencian como `external: true`:

```bash
docker network create network-app-evently
```

> Puedes verificar con `docker network ls`. Si la red ya existe, este comando fallará inofensivamente.

---

## Orden recomendado de arranque

> **Importante**: El servicio **HTTP** ejecuta **migraciones** automáticamente antes de iniciar (entrypoint). Asegúrate de que Mysql esté **arriba** antes de levantar HTTP.

### 1) Mysql

```bash
docker-compose -f docker-compose.mysql.yml -p app-evently up -d
```

### 2) Redis

```bash
docker-compose -f docker-compose.redis.yml -p app-evently up -d
```

### 3) HTTP (API)

```bash
docker-compose -f docker-compose.http.yml -p app-evently up -d
docker-compose -f docker-compose.http.yml -p app-evently logs -f http
```

### 4) WEB (Vuejs)

```bash
docker-compose -f docker-compose.web.yml -p app-evently up -d
docker-compose -f docker-compose.web.yml -p app-evently logs -f web
```

---

## Puertos por servicio (host → container)

| Servicio          | Host | Container |
| ----------------- | ---- | --------: |
| Frontend HTTP     | 3000 |      3000 |
| Backend HTTP      | 3001 |      3001 |
| Backend WebSocket | 3001 |      3001 |
| DB Mysql          | 3306 |      3306 |
| Cache Redis       | 6379 |      6379 |
