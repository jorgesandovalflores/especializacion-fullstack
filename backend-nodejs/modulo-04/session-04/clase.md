# SESIÓN 4 -- ESTRATEGIAS DE ESCALABILIDAD

## TL;DR (qué corre y cuándo)

-   **Desarrollo (ts-node / vite-node)**: ejecutas **`src/main.ts`** (un
    proceso) o **`src/cluster.ts`** (multi‑proceso local).\
-   **Producción sin K8s (VPS/VM)**: compilas a **`dist/`** y ejecutas
    con **PM2**:
    -   **Cluster mode (un solo puerto compartido)**: script principal
        **`dist/main.js`**; PM2 crea N workers.
    -   **Fork mode (varios puertos)**: ejecutas **varias instancias**
        con `PORT=3001..300N` y balanceas con **Nginx**.
-   **Producción con Kubernetes**: **1 proceso por pod**. Ejecutas
    **`dist/main.js`** dentro del contenedor; escalas con
    **réplicas/HPA** (no uses PM2 cluster dentro del pod).

------------------------------------------------------------------------

## 0) Base del proyecto (NestJS + Express)

**Estructura mínima:**

    src/
      main.ts          # entrypoint de la app HTTP
      cluster.ts       # opcional: master que forkea workers locales
      app.module.ts    # Nest root module
      health.controller.ts

### `src/main.ts` (graceful, health y PORT)

``` ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';

async function bootstrap() {
    // Crear app (Express por defecto)
    const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });

    // Endpoint de salud (útil para LB/Ingress/HPA)
    app.getHttpAdapter().get('/health', (_req: any, res: any) => res.status(200).send('ok'));

    const server = http.createServer(app.getHttpAdapter().getInstance());

    const PORT = Number(process.env.PORT || 3000);
    await app.init();

    // Apagado limpio en SIGTERM/SIGINT
    function shutdown() {
        // Cerrar servidor HTTP y conexiones abiertas
        server.close(() => process.exit(0));
        // Kill duro si algo se cuelga
        setTimeout(() => process.exit(1), 10000);
    }
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    server.listen(PORT, () => {
        console.log(`HTTP listening on port ${PORT} pid=${process.pid}`);
    });
}
bootstrap();
```

> **Qué corre aquí:** este archivo es el **entrypoint real** de tu app
> (dev y prod).\
> En **PM2 cluster**, PM2 hará *forks* de **este mismo archivo** para
> usar varios cores.

------------------------------------------------------------------------

## 1) Clustering en un solo servidor (multiproceso)

### Opción A --- `src/cluster.ts` (cluster **desde tu código**)

**Cuándo usarlo:** quieres controlar tú el forkeo (sin PM2) o hacer
pruebas locales.

``` ts
// src/cluster.ts
// Clustering nativo de Node: crea N workers que ejecutan tu app (main.ts)

// @ts-ignore: importar tipos
import cluster from 'cluster';
import os from 'os';

async function run() {
    if (cluster.isPrimary) {
        // Número de workers = núcleos, o variable WORKERS
        const total = Number(process.env.WORKERS || os.cpus().length);
        console.log(`Primary ${process.pid} starting ${total} workers...`);

        for (let i = 0; i < total; i++) {
            cluster.fork();
        }

        // Auto-restart si muere un worker
        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died. Restarting...`);
            cluster.fork();
        });
    } else {
        // Importamos aquí para que solo los workers abran el puerto
        await import('./main'); // ← corre la app real
    }
}
run();
```

**¿Qué archivo se corre?** - **Dev**: `ts-node src/cluster.ts` (o
`pnpm start:dev:cluster`). - **Prod**: compilas y corres
`node dist/cluster.js`.

**¿dist o src?** - En **desarrollo** puedes correr `src/cluster.ts` con
ts-node. - En **producción** siempre **`dist/cluster.js`** (compilado
por `tsc`).

#### Scripts recomendados en `package.json`

``` json
{
  "scripts": {
    "start:dev": "ts-node --transpile-only src/main.ts",
    "start:dev:cluster": "ts-node --transpile-only src/cluster.ts",
    "build": "tsc -p tsconfig.json",
    "start:prod": "node dist/main.js",
    "start:prod:cluster": "node dist/cluster.js"
  }
}
```

> Nota: **O usas cluster.ts** **o** usas **PM2 cluster**. No ambos a la
> vez.

------------------------------------------------------------------------

### Opción B --- **PM2 cluster** (recomendado en VM, sin K8s)

PM2 hace clustering **sobre tu `dist/main.js`**. No necesitas
`cluster.ts`.

#### `ecosystem.config.js`

``` js
// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'api',
            script: 'dist/main.js',      // ← entrypoint real
            exec_mode: 'cluster',        // ← PM2 usa cluster nativo de Node
            instances: 'max',            // ← 1 worker por core
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: 3000               // ← todos los workers comparten el PUERTO
            }
        }
    ]
};
```

> En **cluster mode**, **TODOS** los workers comparten **el mismo
> puerto** (p.ej. 3000). PM2 usa el módulo `cluster` para balancear
> conexiones entre workers.

#### Scripts en `package.json`

``` json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "pm2:start": "pm2 start ecosystem.config.js && pm2 save",
    "pm2:reload": "pm2 reload api",
    "pm2:stop": "pm2 stop api",
    "pm2:logs": "pm2 logs api",
    "pm2:monit": "pm2 monit"
  }
}
```

#### Comandos típicos

``` bash
pnpm build
pnpm pm2:start       # inicia en cluster (dist/main.js)
pnpm pm2:logs
pnpm pm2:reload
```

------------------------------------------------------------------------

## 2) Nginx como reverse proxy (dos patrones)

> Aquí completo **cómo usar Nginx tanto con PM2 cluster** (un puerto)
> **como con múltiples puertos** (fork mode). Además incluyo WebSocket.

### Patrón A --- **PM2 cluster** (un solo puerto)

**Arquitectura:**

    Cliente → Nginx :80/:443 → 127.0.0.1:3000 (PM2 reparte entre workers)

**`/etc/nginx/conf.d/api.conf`**

``` nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;

        # WebSocket
        proxy_set_header Upgrade            $http_upgrade;
        proxy_set_header Connection         "upgrade";

        proxy_pass http://127.0.0.1:3000;   # ← único puerto; PM2 cluster balancea dentro
        proxy_read_timeout 75s;
        proxy_send_timeout 75s;
    }
}
```

### Patrón B --- **Múltiples puertos** (fork mode sin cluster)

**Arquitectura:**

    Cliente → Nginx → upstream { 127.0.0.1:3001, 3002, 3003 }

**Arranque (ejemplo con PM2 en `fork` y puertos distintos):**

``` bash
PORT=3001 pm2 start dist/main.js --name api-3001 --instances 1 --exec-mode fork
PORT=3002 pm2 start dist/main.js --name api-3002 --instances 1 --exec-mode fork
PORT=3003 pm2 start dist/main.js --name api-3003 --instances 1 --exec-mode fork
pm2 save
```

**`/etc/nginx/conf.d/api.conf`**

``` nginx
upstream api_upstream {
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;

        # WebSocket
        proxy_set_header Upgrade            $http_upgrade;
        proxy_set_header Connection         "upgrade";

        proxy_pass http://api_upstream;
        proxy_read_timeout 75s;
        proxy_send_timeout 75s;
    }
}
```

------------------------------------------------------------------------

## 2.2 ¿Cómo "clusteriza" Kubernetes? (explicación + diagrama)

**Flujo de red (simplificado):**

    [Client/Internet]
            |
       [Ingress Controller]
            |
         [Service] (ClusterIP)
            |
         +--------+---------+
         |        |         |
      [Pod A]  [Pod B]   [Pod C]
       (api)    (api)     (api)

### Manifiestos mínimos

**Deployment**

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/api:1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
            - name: PORT
              value: "3000"
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
```

**Service**

``` yaml
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

**Ingress**

``` yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ing
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 80
```

------------------------------------------------------------------------

## 3) Dockerfile (prod)

``` dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

------------------------------------------------------------------------

## 4) AWS / DigitalOcean

-   **AWS EC2 + Nginx + PM2**: VM única con PM2 cluster y Nginx.\
-   **AWS EKS**: Kubernetes administrado con pods y HPA.\
-   **DigitalOcean Droplet**: patrón similar a EC2.\
-   **DOKS**: Kubernetes administrado simplificado.

------------------------------------------------------------------------

## 5) Decisiones rápidas

| Escenario            | Qué correr                 | Balanceo             | Notas                    |
|----------------------|----------------------------|----------------------|--------------------------|
| 1 VM pequeña         | `dist/main.js` con **PM2 cluster** | Nginx → `127.0.0.1:3000` | Simple                   |
| 1 VM, múltiples puertos | Varias instancias en 3001..3003 | Nginx upstream        | Afinidad opcional        |
| Kubernetes           | **1 proceso/pod**          | Service/Ingress      | Health checks, HPA       |
| WebSockets           | Cualquiera                 | Mejor Redis Adapter  | Evitas sticky            |


------------------------------------------------------------------------

## 6) Errores comunes

-   Duplicar clustering (no uses cluster.ts y PM2 a la vez).\
-   Olvidar graceful shutdown (usar SIGTERM).\
-   Guardar estado en memoria (usa Redis o JWT).\
-   Usar PM2 cluster dentro de K8s (innecesario).\
-   Config incompleta de Nginx (faltan headers WS).

------------------------------------------------------------------------

## 7) Resumen operativo

### A) VM con PM2 cluster

``` bash
pnpm build
pnpm pm2:start
```

### B) VM con múltiples puertos

``` bash
PORT=3001 pm2 start dist/main.js --name api-3001 --exec-mode fork
...
```

### C) Kubernetes

``` bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```
