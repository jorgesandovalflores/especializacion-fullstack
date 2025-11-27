# App taxi — Infra

Este directorio contiene la **configuración modular de infraestructura** para el backend de `app-taxi`, basada en **Docker Compose**. Permite levantar **Mysql**, **Redis** y los **modos de la app** (HTTP, CRON y WEBSOCKET) de forma **independiente**, compartiendo una **red externa** y variables de entorno comunes.

---

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
-   Red externa compartida (p. ej. `network-app-taxi`) para vincular servicios entre archivos Compose

---

## Variables de entorno

Ejemplo **.env** (recortado a lo esencial para infra). Adecúa nombres/credenciales a tu entorno:

```env
PROJECT_NAME="app-taxi"
NETWORK="network-app-taxi"
TZ="America/Lima"

# Mysql
MYSQL_CONTAINER_NAME="mysql-app-taxi"
MYSQL_ROOT_PASSWORD="root"
MYSQL_DATABASE="db_app_taxi"
MYSQL_VOLUME="mysql_volume"

# Redis
REDIS_CONTAINER_NAME="redis-app-taxi"
REDIS_PORT="6379"
REDIS_VOLUME="redis_volume"

# Http
HTTP_CONTAINER_NAME="http-app-taxi"
HTTP_DOCKER_PLATFORM="linux/amd64"
HTTP_NODE_ENV="development"
HTTP_NODE_DEBUG="false"
HTTP_DB_POOL="10"
HTTP_APPLICATION_PORT="3001"
HTTP_JWT_ACCESS_TTL_SEC="900"
HTTP_JWT_REFRESH_TTL_SEC="2592000"
HTTP_JWT_ACCESS_SECRET="Key@Access@Secret."
HTTP_JWT_REFRESH_SECRET="Key@Refresh@Secret."
HTTP_BREVO_API_KEY="api_brevo"
HTTP_BREVO_TEXT_SMS="Tu código de verificación es: "
HTTP_BREVO_SENDER="AppTaxi"
HTTP_GOOGLE_API_KEY="tu_key"
HTTP_ADDRESS_SEARCH_PROVIDER="nominatim"
HTTP_FIREBASE_PROJECT_ID=""
HTTP_FIREBASE_CLIENT_EMAIL=""
HTTP_FIREBASE_PRIVATE_KEY=""
```

---

## Red compartida (una sola vez)

Crea la red externa (si no existe). Todas las composiciones la referencian como `external: true`:

```bash
docker network create network-app-taxi
```

> Puedes verificar con `docker network ls`. Si la red ya existe, este comando fallará inofensivamente.

---

## Orden recomendado de arranque

> **Importante**: El servicio **HTTP** ejecuta **migraciones** automáticamente antes de iniciar (entrypoint). Asegúrate de que Mysql esté **arriba** antes de levantar HTTP.

### 1) Mysql

```bash
docker-compose -f docker-compose.mysql.yml -p app-taxi up -d
```

### 2) Redis

```bash
docker-compose -f docker-compose.redis.yml -p app-taxi up -d
```

### 3) HTTP (API)

```bash
docker-compose -f docker-compose.http.yml -p app-taxi up -d
docker-compose -f docker-compose.http.yml -p app-taxi logs -f http
```

---

## Puertos por servicio (host → container)

| Servicio          | Host | Container |
| ----------------- | ---- | --------: |
| Backend HTTP      | 3001 |      3001 |
| Backend WebSocket | 3002 |      3002 |
| DB Mysql          | 3306 |      3306 |
| Cache Redis       | 6379 |      6379 |
