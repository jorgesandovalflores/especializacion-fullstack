# SESIÓN 1 – DESPLIEGUE DE FRONTEND EN AWS

## OBJETIVOS DE APRENDIZAJE

Al finalizar esta sesión, los participantes serán capaces de:

1. **Identificar y comparar** las diferentes opciones de hosting para aplicaciones frontend en AWS
2. **Desplegar** una aplicación SPA (Single Page Application) utilizando AWS Amplify
3. **Configurar** pipelines de CI/CD automatizados integrando GitHub con AWS Amplify
4. **Aplicar** buenas prácticas de entrega continua para proyectos frontend en producción
5. **Evaluar** qué solución de hosting es más apropiada según los requisitos del proyecto

---

## CONTENIDO

1. **Opciones de Hosting para Frontend en AWS**

    - Amazon S3 + CloudFront
    - AWS Amplify Hosting
    - Amazon EC2
    - AWS Elastic Beanstalk
    - Amazon Lightsail
    - Comparativa y casos de uso

2. **Implementación con AWS Amplify para SPA**

    - Configuración inicial del proyecto Vue.js 3 + TypeScript + Tailwind
    - Despliegue manual en Amplify
    - Configuración de dominio personalizado
    - Variables de entorno

3. **Configuración de CI/CD con GitHub y Amplify**

    - Conexión del repositorio GitHub
    - Configuración del build settings
    - Automatización de deploys
    - Manejo de ramas y entornos

4. **Buenas Prácticas para Entrega Continua**

---

## 1. OPCIONES DE HOSTING PARA FRONTEND EN AWS

### 1.1 Amazon S3 + CloudFront

**Descripción:**
Amazon S3 (Simple Storage Service) combinado con CloudFront (CDN global) es la opción más tradicional y económica para hospedar sitios web estáticos.

**Arquitectura:**

```
Usuario → CloudFront (CDN) → S3 Bucket (archivos estáticos)
```

**Características principales:**

-   **Costo:** Muy económico, pagas solo por almacenamiento y transferencia de datos
-   **Escalabilidad:** Ilimitada automáticamente
-   **Disponibilidad:** 99.99% SLA
-   **SSL/TLS:** Certificados gratuitos con AWS Certificate Manager
-   **Complejidad:** Moderada, requiere configuración manual

**Casos de uso ideales:**

-   Sitios web estáticos o SPAs simples
-   Landing pages y sitios corporativos
-   Documentación técnica
-   Proyectos con presupuesto muy limitado
-   Cuando necesitas control total sobre la configuración de caching
-   Aplicaciones que ya tienen CI/CD en otra plataforma

**Ventajas:**

-   Máximo control sobre la configuración
-   Costo extremadamente bajo
-   Integración nativa con otros servicios AWS
-   Excelente para sitios de alto tráfico

**Desventajas:**

-   Configuración manual del CI/CD
-   Requiere configurar invalidaciones de CloudFront manualmente
-   No incluye preview de pull requests
-   Configuración inicial más compleja

**Ejemplo de costos:**

-   Sitio de 100MB: ~$0.023/mes en S3
-   1TB de transferencia: ~$85/mes en CloudFront
-   Total estimado para sitio pequeño: <$5/mes

---

### 1.2 AWS Amplify Hosting

**Descripción:**
Servicio completamente administrado diseñado específicamente para aplicaciones web modernas con CI/CD integrado.

**Arquitectura:**

```
GitHub/GitLab → Amplify → Build → CDN Global → Usuario
```

**Características principales:**

-   **Costo:** Incluye build minutes y hosting
-   **CI/CD:** Integrado nativamente
-   **Preview:** Ambientes de preview automáticos por PR
-   **SSL/TLS:** Automático y gratuito
-   **Complejidad:** Baja, muy automatizado

**Casos de uso ideales:**

-   SPAs modernas (React, Vue, Angular)
-   Proyectos en desarrollo activo con múltiples developers
-   Aplicaciones que necesitan despliegues frecuentes
-   Startups y equipos ágiles
-   Proyectos con múltiples entornos (dev, staging, prod)
-   Aplicaciones que usan otros servicios de Amplify (Auth, API, Storage)

**Ventajas:**

-   CI/CD completamente automatizado
-   Preview deployments automáticos
-   Rollback con un click
-   Monitoreo integrado
-   Soporte para SSR (Server-Side Rendering)
-   Configuración mínima requerida
-   Atomic deployments (todo o nada)

**Desventajas:**

-   Más costoso que S3+CloudFront
-   Menos control granular sobre caching
-   Build minutes limitados en plan gratuito

**Ejemplo de costos:**

-   1000 build minutes: $0.01/minuto = $10
-   15GB almacenamiento: incluido gratis
-   100GB transferencia: $0.15/GB = $15
-   Total estimado: ~$25-50/mes para proyecto mediano

**Plan gratuito:**

-   1000 build minutes/mes
-   15GB almacenamiento
-   100GB transferencia/mes

---

### 1.3 Amazon EC2

**Descripción:**
Servidores virtuales donde instalas y configuras tu propio servidor web (Nginx, Apache).

**Arquitectura:**

```
Usuario → Load Balancer → EC2 Instance(s) → Nginx → App
```

**Características principales:**

-   **Costo:** Instancia t3.micro ~$8-10/mes
-   **Escalabilidad:** Manual o con Auto Scaling
-   **Control:** Total sobre el sistema operativo
-   **Complejidad:** Alta, requiere administración

**Casos de uso ideales:**

-   Aplicaciones que requieren Server-Side Rendering (SSR) con Node.js
-   Necesidad de ejecutar procesos en background
-   Aplicaciones con lógica de servidor compleja
-   Cuando necesitas software específico en el servidor
-   Legacy applications que no son puramente estáticas
-   Aplicaciones que requieren WebSockets persistentes

**Ventajas:**

-   Control total del servidor
-   Puedes ejecutar cualquier software
-   Ideal para aplicaciones híbridas
-   Flexibilidad máxima

**Desventajas:**

-   Requiere mantenimiento del servidor
-   Gestión de seguridad y parches
-   Configuración de CI/CD completamente manual
-   Mayor complejidad operativa
-   Necesitas expertise en DevOps

---

### 1.4 AWS Elastic Beanstalk

**Descripción:**
Plataforma como servicio (PaaS) que abstrae la infraestructura pero te da más control que Amplify.

**Características principales:**

-   **Costo:** Similar a EC2 + servicios adicionales
-   **Escalabilidad:** Auto Scaling automático
-   **Complejidad:** Media

**Casos de uso ideales:**

-   Aplicaciones web full-stack (frontend + backend en mismo proyecto)
-   Aplicaciones Node.js con SSR (Next.js, Nuxt.js)
-   Cuando necesitas más control que Amplify pero menos que EC2
-   Equipos con experiencia limitada en DevOps
-   Aplicaciones que necesitan diferentes entornos gestionados

**Ventajas:**

-   Gestión automática de capacidad
-   Monitoreo y health checks integrados
-   Soporte para múltiples lenguajes
-   Despliegues con rollback automático

**Desventajas:**

-   Más complejo que Amplify
-   Menos flexible que EC2
-   Costo más alto que soluciones estáticas

---

### 1.5 Amazon Lightsail

**Descripción:**
Solución VPS simplificada con precio predecible, ideal para proyectos pequeños.

**Características principales:**

-   **Costo:** Desde $3.50/mes (precio fijo)
-   **Escalabilidad:** Limitada, upgrade manual
-   **Complejidad:** Baja-Media

**Casos de uso ideales:**

-   Proyectos personales o MVPs
-   Presupuesto fijo predecible
-   Aplicaciones de bajo tráfico
-   Desarrolladores que prefieren soluciones simples
-   WordPress y CMS tradicionales

**Ventajas:**

-   Precio fijo y predecible
-   Interface muy simple
-   Incluye IP estática
-   Snapshots automáticos

**Desventajas:**

-   Escalabilidad limitada
-   Menos integración con servicios AWS avanzados
-   No es la mejor opción para producción enterprise

---

### 1.6 Comparativa General

| Característica      | S3+CloudFront | Amplify    | EC2      | Elastic Beanstalk | Lightsail       |
| ------------------- | ------------- | ---------- | -------- | ----------------- | --------------- |
| **Costo inicial**   | Muy bajo      | Bajo       | Medio    | Medio             | Muy bajo (fijo) |
| **Escalabilidad**   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐        | ⭐⭐            |
| **Facilidad setup** | ⭐⭐⭐        | ⭐⭐⭐⭐⭐ | ⭐⭐     | ⭐⭐⭐            | ⭐⭐⭐⭐        |
| **CI/CD integrado** | ❌            | ✅         | ❌       | ⚠️                | ❌              |
| **SSR Support**     | ❌            | ✅         | ✅       | ✅                | ✅              |
| **Preview deploys** | ❌            | ✅         | ❌       | ❌                | ❌              |
| **Mantenimiento**   | Bajo          | Muy bajo   | Alto     | Medio             | Medio           |
| **Control**         | Alto          | Medio      | Muy alto | Medio             | Medio           |

---

### 1.7 Árbol de Decisión

```
¿Tu aplicación es 100% estática (SPA sin SSR)?
├─ SÍ → ¿Necesitas CI/CD automatizado con previews?
│   ├─ SÍ → AWS Amplify [OK]
│   └─ NO → ¿Presupuesto muy limitado?
│       ├─ SÍ → S3 + CloudFront [OK]
│       └─ NO → AWS Amplify (por conveniencia) [OK]
│
└─ NO → ¿Necesitas SSR o lógica de servidor?
    ├─ Framework moderno (Next.js/Nuxt.js)
    │   └─ Elastic Beanstalk o Amplify (con SSR) [OK]
    │
    ├─ Aplicación compleja / microservicios
    │   └─ EC2 con Auto Scaling [OK]
    │
    └─ Proyecto pequeño / MVP
        └─ Lightsail [OK]
```

---

## 2. IMPLEMENTACIÓN CON AWS AMPLIFY PARA SPA

Vamos a crear una aplicación Vue.js 3 con TypeScript y Tailwind CSS, y desplegarla en AWS Amplify paso a paso.

### 2.1 Creación del Proyecto Vue.js 3

**Paso 1: Crear el proyecto**

```bash
# Crear proyecto con Vite
npm create vite@latest frontend-aws-demo -- --template vue-ts

# Navegar al directorio
cd frontend-aws-demo

# Instalar dependencias
npm install
```

**Paso 2: Instalar y configurar Tailwind CSS**

```bash
# Instalar Tailwind y dependencias
npm install -D tailwindcss postcss autoprefixer

# Inicializar Tailwind
npx tailwindcss init -p
```

**Paso 3: Configurar Tailwind**

Editar `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

**Paso 4: Agregar directivas de Tailwind**

Crear/editar `src/style.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Paso 5: Crear componente de ejemplo**

Editar `src/App.vue`:

```vue
<script setup lang="ts">
import { ref } from "vue";

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

const tasks = ref<Task[]>([
    { id: 1, title: "Configurar AWS Amplify", completed: true },
    { id: 2, title: "Desplegar aplicación", completed: false },
    { id: 3, title: "Configurar CI/CD", completed: false },
]);

const newTaskTitle = ref("");

const addTask = () => {
    if (newTaskTitle.value.trim()) {
        tasks.value.push({
            id: Date.now(),
            title: newTaskTitle.value,
            completed: false,
        });
        newTaskTitle.value = "";
    }
};

const toggleTask = (id: number) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) task.completed = !task.completed;
};

const deleteTask = (id: number) => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
};
</script>

<template>
    <div
        class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4"
    >
        <div class="max-w-2xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">
                    Task Manager
                </h1>
                <p class="text-gray-600">Desplegado con AWS Amplify</p>
            </div>

            <!-- Add Task Form -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <form @submit.prevent="addTask" class="flex gap-2">
                    <input
                        v-model="newTaskTitle"
                        type="text"
                        placeholder="Nueva tarea..."
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Agregar
                    </button>
                </form>
            </div>

            <!-- Tasks List -->
            <div class="space-y-3">
                <div
                    v-for="task in tasks"
                    :key="task.id"
                    class="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                    <input
                        type="checkbox"
                        :checked="task.completed"
                        @change="toggleTask(task.id)"
                        class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                        :class="[
                            'flex-1 text-lg',
                            task.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-800',
                        ]"
                    >
                        {{ task.title }}
                    </span>
                    <button
                        @click="deleteTask(task.id)"
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div
                v-if="tasks.length === 0"
                class="bg-white rounded-lg shadow-md p-12 text-center"
            >
                <p class="text-gray-400 text-lg">
                    No hay tareas. ¡Agrega una nueva!
                </p>
            </div>

            <!-- Footer -->
            <div class="mt-8 text-center text-sm text-gray-600">
                <p>Construido con Vue 3 + TypeScript + Tailwind CSS</p>
                <p class="mt-1">Hospedado en AWS Amplify</p>
            </div>
        </div>
    </div>
</template>
```

**Paso 6: Actualizar main.ts**

```typescript
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

createApp(App).mount("#app");
```

**Paso 7: Probar localmente**

```bash
npm run dev
```

Visita `http://localhost:5173` para ver la aplicación funcionando.

---

### 2.2 Preparar el Proyecto para Despliegue

**Paso 8: Crear repositorio en GitHub**

```bash
# Inicializar git (si no está inicializado)
git init

# Crear .gitignore
echo "node_modules
dist
.DS_Store
*.local" > .gitignore

# Agregar archivos
git add .
git commit -m "Initial commit: Vue3 + TypeScript + Tailwind"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/frontend-aws-demo.git
git branch -M main
git push -u origin main
```

**Paso 9: Verificar configuración de build**

Editar `package.json` para asegurar que los scripts están correctos:

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vue-tsc && vite build",
        "preview": "vite preview"
    }
}
```

**Paso 10: Crear archivo de configuración de Amplify (opcional pero recomendado)**

Crear `amplify.yml` en la raíz del proyecto:

```yaml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - npm ci
        build:
            commands:
                - npm run build
    artifacts:
        baseDirectory: dist
        files:
            - "**/*"
    cache:
        paths:
            - node_modules/**/*
```

Este archivo le indica a Amplify:

-   Qué comandos ejecutar antes del build (`npm ci`)
-   Cómo construir el proyecto (`npm run build`)
-   Dónde están los archivos compilados (`dist`)
-   Qué cachear para builds más rápidos (`node_modules`)

---

### 2.3 Despliegue en AWS Amplify

**Paso 11: Acceder a AWS Amplify Console**

1. Inicia sesión en AWS Console
2. Busca "Amplify" en el buscador de servicios
3. Click en "Get Started" bajo "Amplify Hosting"

**Paso 12: Conectar repositorio**

1. Selecciona "GitHub" como proveedor
2. Click en "Connect branch"
3. Autoriza a AWS Amplify a acceder a tu cuenta de GitHub
4. Selecciona tu repositorio `frontend-aws-demo`
5. Selecciona la rama `main`

**Paso 13: Configurar build settings**

Amplify detectará automáticamente que es un proyecto Vite y sugerirá configuración:

```yaml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - npm ci
        build:
            commands:
                - npm run build
    artifacts:
        baseDirectory: dist
        files:
            - "**/*"
    cache:
        paths:
            - node_modules/**/*
```

Si creaste el archivo `amplify.yml`, Amplify usará esa configuración automáticamente.

**Paso 14: Configuración avanzada (opcional)**

-   **App name:** frontend-aws-demo
-   **Environment name:** production
-   **Service role:** Crear nuevo role (Amplify lo hará automáticamente)

**Paso 15: Revisar y desplegar**

1. Revisa toda la configuración
2. Click en "Save and deploy"
3. Amplify comenzará el proceso de build y deploy

**Proceso de despliegue:**

```
1. Provision ✓ (30s)
2. Build ✓ (2-3 min)
   - npm ci
   - npm run build
3. Deploy ✓ (30s)
   - Subir archivos al CDN
4. Verify ✓ (10s)
```

**Paso 16: Acceder a tu aplicación**

Una vez completado, Amplify te dará una URL:

```
https://main.d1234abcd5678.amplifyapp.com
```

Tu aplicación ahora está desplegada y accesible globalmente!

---

### 2.4 Configuración de Dominio Personalizado

**Paso 17: Agregar dominio propio**

1. En Amplify Console, ve a "Domain management"
2. Click en "Add domain"
3. Ingresa tu dominio (ejemplo: `miapp.com`)
4. Amplify generará registros DNS que debes agregar en tu proveedor de DNS

**Configuración DNS (ejemplo):**

```
Type: CNAME
Name: www
Value: main.d1234abcd5678.amplifyapp.com

Type: A
Name: @
Value: [IP proporcionada por Amplify]
```

5. Amplify validará el dominio y generará certificado SSL automáticamente (gratis)
6. En 5-10 minutos tu app estará disponible en tu dominio personalizado

---

### 2.5 Variables de Entorno

**Paso 18: Configurar variables de entorno**

1. En Amplify Console, ve a "Environment variables"
2. Click en "Manage variables"
3. Agregar variables:

```
VITE_API_URL = https://api.miapp.com
VITE_ENV = production
```

**Paso 19: Usar variables en tu código**

Editar `src/App.vue` para agregar un ejemplo:

```vue
<script setup lang="ts">
// Acceder a variables de entorno
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const environment = import.meta.env.VITE_ENV || "development";

console.log("API URL:", apiUrl);
console.log("Environment:", environment);

// ... resto del código
</script>
```

**Importante:** Las variables de entorno en Vite deben tener el prefijo `VITE_` para estar disponibles en el frontend.

**Paso 20: Redeploy para aplicar cambios**

Las variables de entorno solo se aplican en el siguiente build. Para forzar un rebuild:

1. Ve a la consola de Amplify
2. Click en "Redeploy this version"
3. O haz un nuevo commit en GitHub

---

## 3. CONFIGURACIÓN DE CI/CD CON GITHUB Y AMPLIFY

Ahora configuraremos un pipeline completo de CI/CD que se activará automáticamente con cada push o pull request.

### 3.1 Configuración Básica de CI/CD

La conexión con GitHub que hicimos anteriormente ya habilitó CI/CD básico:

**¿Qué sucede automáticamente?**

```
Push a main → Amplify detecta cambio → Build automático → Deploy automático
```

**Paso 21: Verificar que CI/CD está activo**

1. Haz un cambio en tu código local:

```vue
<!-- src/App.vue -->
<h1 class="text-4xl font-bold text-gray-800 mb-2">
  Task Manager v2.0
</h1>
```

2. Commit y push:

```bash
git add .
git commit -m "feat: update title to v2.0"
git push origin main
```

3. Ve a Amplify Console y observa:
    - Se inicia un nuevo build automáticamente
    - Puedes ver logs en tiempo real
    - Una vez completado, tu cambio está en producción

---

### 3.2 Configuración de Múltiples Entornos

**Paso 22: Crear rama de desarrollo**

```bash
# Crear y cambiar a rama develop
git checkout -b develop
git push -u origin develop
```

**Paso 23: Conectar rama develop en Amplify**

1. En Amplify Console, ve a tu app
2. Click en "Connect branch"
3. Selecciona la rama `develop`
4. Amplify creará un nuevo entorno automáticamente

Ahora tendrás dos URLs:

```
Production: https://main.d1234abcd5678.amplifyapp.com
Development: https://develop.d1234abcd5678.amplifyapp.com
```

**Paso 24: Configurar variables por entorno**

1. Ve a "Environment variables"
2. Configura variables específicas por rama:

```
Branch: main
  VITE_API_URL = https://api.miapp.com
  VITE_ENV = production

Branch: develop
  VITE_API_URL = https://dev-api.miapp.com
  VITE_ENV = development
```

---

### 3.3 Preview Deployments para Pull Requests

Una de las características más poderosas de Amplify es la generación automática de previews para Pull Requests.

**Paso 25: Habilitar previews**

1. En Amplify Console, ve a "Previews"
2. Click en "Enable previews"
3. Selecciona que ramas pueden generar previews:
    - Pull requests to: `main`
    - Pull requests to: `develop`

**Paso 26: Probar preview deployment**

1. Crea una nueva rama para una feature:

```bash
git checkout develop
git checkout -b feature/add-priority
```

2. Haz cambios en tu código:

```vue
<script setup lang="ts">
interface Task {
    id: number;
    title: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
}

const tasks = ref<Task[]>([
    {
        id: 1,
        title: "Configurar AWS Amplify",
        completed: true,
        priority: "high",
    },
    {
        id: 2,
        title: "Desplegar aplicación",
        completed: false,
        priority: "medium",
    },
]);

const addTask = () => {
    if (newTaskTitle.value.trim()) {
        tasks.value.push({
            id: Date.now(),
            title: newTaskTitle.value,
            completed: false,
            priority: "medium",
        });
        newTaskTitle.value = "";
    }
};
</script>

<template>
    <!-- Actualizar template para mostrar prioridad -->
    <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-white rounded-lg shadow-md p-4"
    >
        <div class="flex items-center gap-4">
            <input
                type="checkbox"
                :checked="task.completed"
                @change="toggleTask(task.id)"
            />
            <span :class="[task.completed ? 'line-through' : '']">{{
                task.title
            }}</span>
            <span
                :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800',
                ]"
            >
                {{ task.priority }}
            </span>
            <button
                @click="deleteTask(task.id)"
                class="ml-auto px-4 py-2 bg-red-500 text-white rounded"
            >
                Eliminar
            </button>
        </div>
    </div>
</template>
```

3. Commit y push:

```bash
git add .
git commit -m "feat: add priority to tasks"
git push -u origin feature/add-priority
```

4. Crea Pull Request en GitHub:

    - Ve a GitHub
    - Click en "Compare & pull request"
    - Base: `develop` ← Compare: `feature/add-priority`
    - Crea el PR

5. **¡Magia!** Amplify automáticamente:
    - Detecta el PR
    - Crea un build
    - Genera una URL única de preview
    - Comenta en el PR con el link

```
Preview URL: https://pr-1.d1234abcd5678.amplifyapp.com
```

6. Revisa la preview, y si todo está bien, haz merge del PR
7. Amplify automáticamente desplegará a `develop` y eliminará el preview

---

### 3.4 Configuración Avanzada de Build

**Paso 27: Personalizar build settings**

Editar `amplify.yml` para agregar tests y linting:

```yaml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - npm ci
                # Ejecutar linting
                - npm run lint || true
        build:
            commands:
                - echo "Building for environment: $VITE_ENV"
                - npm run build
        postBuild:
            commands:
                - echo "Build completed successfully!"
                # Aquí podrías agregar tests, notificaciones, etc.
    artifacts:
        baseDirectory: dist
        files:
            - "**/*"
    cache:
        paths:
            - node_modules/**/*
    customHeaders:
        - pattern: "**/*"
          headers:
              - key: "Cache-Control"
                value: "public, max-age=31536000, immutable"
              - key: "X-Frame-Options"
                value: "DENY"
              - key: "X-Content-Type-Options"
                value: "nosniff"
```

**Paso 28: Agregar script de lint en package.json**

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vue-tsc && vite build",
        "preview": "vite preview",
        "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
    }
}
```

---

### 3.5 Webhooks y Notificaciones

**Paso 29: Configurar webhook para Slack (opcional)**

1. En Amplify Console, ve a "Notifications"
2. Click en "Add notification"
3. Selecciona eventos:
    - Build succeeds
    - Build fails
    - Deployment succeeds
4. Ingresa webhook URL de Slack
5. Amplify enviará notificaciones automáticamente

**Paso 30: Monitoreo y Logs**

1. En Amplify Console, accede a "Monitoring"
2. Verás métricas importantes:

    - Requests por minuto
    - Bytes transferidos
    - Errores 4xx y 5xx
    - Latencia

3. Para logs detallados:
    - Click en cualquier build
    - Ve logs en tiempo real
    - Descarga logs para análisis

---

### 3.6 Rollback y Redeployments

**Paso 31: Rollback a versión anterior**

Si un deploy introduce un bug:

1. Ve a "Build history"
2. Encuentra el último deploy estable
3. Click en "Redeploy this version"
4. En 1-2 minutos estarás de vuelta a la versión anterior

**Ventaja:** No necesitas hacer `git revert`, puedes volver a cualquier versión con un click.

---

### 3.7 Build Performance y Optimización

**Paso 32: Optimizar tiempos de build**

1. **Usar caché efectivamente:**

```yaml
cache:
    paths:
        - node_modules/**/*
        - .npm/**/*
```

2. **Usar npm ci en lugar de npm install:**

```yaml
preBuild:
    commands:
        - npm ci # Más rápido y determinista
```

3. **Paralelizar builds (si usas monorepo):**

```yaml
build:
    commands:
        - npm run build -- --parallel
```

**Resultados típicos:**

-   Primer build: 3-4 minutos
-   Builds con caché: 1-2 minutos
-   Preview builds: 1-2 minutos

---

## 4. BUENAS PRÁCTICAS PARA ENTREGA CONTINUA

### 4.1 Gestión de Ramas y Workflow

**Estrategia de branching recomendada:**

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (previews)
hotfix/* (previews)
```

**Reglas:**

1. **main**: Solo código probado y listo para producción
2. **develop**: Integración continua de features
3. **feature/**: Branches de corta duración (1-3 días)
4. **Proteger main**: Require PR approval antes de merge

**Configurar branch protection en GitHub:**

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Require pull request reviews before merging
4. Require status checks to pass
5. Require branches to be up to date

---

### 4.2 Variables de Entorno y Secretos

**Buenas prácticas:**

1. **Nunca commitear secretos:**

```bash
# .gitignore
.env
.env.local
.env.production
```

2. **Usar variables de entorno en Amplify:**

    - Configurar en Console
    - Diferentes valores por entorno
    - Nunca hardcodear en el código

3. **Prefijos claros:**

```
VITE_API_URL       # Público, expuesto al browser
VITE_FEATURE_FLAG  # Público
AWS_ACCESS_KEY     # Backend only, nunca en frontend
```

4. **Documentar variables requeridas:**

```markdown
# .env.example

VITE_API_URL=https://api.example.com
VITE_ENV=development
VITE_ANALYTICS_ID=your-analytics-id
```

---

### 4.3 Optimización de Build

**1. Code Splitting y Lazy Loading:**

```typescript
// router.ts
const routes = [
    {
        path: "/dashboard",
        component: () => import("./views/Dashboard.vue"), // Lazy load
    },
];
```

**2. Optimización de assets:**

```javascript
// vite.config.ts
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["vue", "vue-router"],
                    ui: ["@headlessui/vue"],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
```

**3. Comprimir assets:**

```yaml
# amplify.yml
customHeaders:
    - pattern: "**/*.js"
      headers:
          - key: "Content-Encoding"
            value: "gzip"
```

---

### 4.4 Testing en CI/CD

**Integrar tests en el pipeline:**

```yaml
# amplify.yml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - npm ci
                - npm run test:unit # Unit tests
        build:
            commands:
                - npm run build
        postBuild:
            commands:
                - npm run test:e2e # E2E tests (opcional)
```

**Tests recomendados:**

1. **Unit tests**: Componentes individuales (Vitest)
2. **Integration tests**: Flujos de usuario
3. **E2E tests**: Cypress/Playwright (solo en staging)

---

### 4.5 Monitoreo y Observabilidad

**1. Error tracking:**

```typescript
// main.ts
import * as Sentry from "@sentry/vue";

Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENV,
});
```

**2. Performance monitoring:**

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

**3. Analytics:**

```typescript
// Google Analytics 4
import VueGtag from "vue-gtag-next";

app.use(VueGtag, {
    property: {
        id: import.meta.env.VITE_GA_ID,
    },
});
```

---

### 4.6 Security Headers

**Configurar headers de seguridad:**

```yaml
# amplify.yml
customHeaders:
    - pattern: "**/*"
      headers:
          # Prevent clickjacking
          - key: "X-Frame-Options"
            value: "DENY"

          # XSS Protection
          - key: "X-XSS-Protection"
            value: "1; mode=block"

          # Prevent MIME sniffing
          - key: "X-Content-Type-Options"
            value: "nosniff"

          # Strict Transport Security
          - key: "Strict-Transport-Security"
            value: "max-age=31536000; includeSubDomains"

          # Content Security Policy
          - key: "Content-Security-Policy"
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

          # Referrer Policy
          - key: "Referrer-Policy"
            value: "strict-origin-when-cross-origin"
```

---

### 4.7 Caching Strategy

**Configurar caché efectivo:**

```yaml
customHeaders:
    # HTML - No cache
    - pattern: "**/*.html"
      headers:
          - key: "Cache-Control"
            value: "no-cache, no-store, must-revalidate"

    # Assets con hash - Cache largo
    - pattern: "**/*.{js,css,png,jpg,jpeg,gif,svg,woff,woff2,ttf,eot}"
      headers:
          - key: "Cache-Control"
            value: "public, max-age=31536000, immutable"

    # Assets sin hash - Cache corto
    - pattern: "**/favicon.ico"
      headers:
          - key: "Cache-Control"
            value: "public, max-age=86400"
```

---

### 4.8 Documentación y Comunicación

**1. README.md completo:**

```markdown
# Frontend AWS Demo

## Despliegue

-   **Production**: https://main.d1234.amplifyapp.com
-   **Development**: https://develop.d1234.amplifyapp.com

## Comandos

-   `npm run dev` - Desarrollo local
-   `npm run build` - Build para producción
-   `npm run preview` - Preview del build local

## Variables de Entorno

Ver `.env.example` para variables requeridas.

## CI/CD

Push a `main` → Deploy automático a producción
Pull Request → Preview deployment automático
```

**2. Pull Request Template:**

```markdown
<!-- .github/pull_request_template.md -->

## Descripción

Breve descripción de los cambios

## Tipo de cambio

-   [ ] Bug fix
-   [ ] Nueva feature
-   [ ] Breaking change
-   [ ] Documentación

## Checklist

-   [ ] Tests agregados/actualizados
-   [ ] Documentación actualizada
-   [ ] Preview deployment verificado
-   [ ] Sin errores de linting
```

---

### 4.9 Checklist de Pre-Deployment

**Antes de cada deployment a producción:**

-   [ ] Tests pasando (unit + integration)
-   [ ] Build exitoso localmente
-   [ ] Linting sin errores
-   [ ] Performance auditada (Lighthouse > 90)
-   [ ] Preview deployment revisado
-   [ ] Variables de entorno configuradas
-   [ ] Security headers configurados
-   [ ] Error tracking activo (Sentry)
-   [ ] Analytics configurado
-   [ ] Documentación actualizada
-   [ ] Rollback plan definido
-   [ ] Stakeholders notificados

---

### 4.10 Manejo de Incidentes

**Plan de respuesta:**

1. **Detección rápida:**

    - Monitoreo activo en Amplify
    - Alertas automáticas (Slack, email)
    - Error tracking (Sentry)

2. **Rollback inmediato:**

    - Un click en Amplify Console
    - < 2 minutos para volver a versión estable

3. **Post-mortem:**

    - Documentar qué salió mal
    - Qué aprendimos
    - Cómo prevenirlo

4. **Comunicación:**
    - Status page para usuarios
    - Updates regulares al equipo
    - Transparencia sobre el problema

---

### 4.11 Métricas y KPIs

**Métricas importantes a monitorear:**

1. **Deployment Frequency:**

    - Meta: > 10 deploys/semana
    - Indica velocidad del equipo

2. **Lead Time:**

    - Meta: < 1 día desde commit a producción
    - Tiempo de commit → deploy

3. **Mean Time to Recovery (MTTR):**

    - Meta: < 1 hora
    - Tiempo para resolver incidentes

4. **Change Failure Rate:**

    - Meta: < 15%
    - % de deploys que requieren rollback

5. **Build Success Rate:**
    - Meta: > 95%
    - % de builds exitosos

**Dashboard en Amplify:**

```
Last 30 days:
- Deployments: 47
- Success rate: 96%
- Avg build time: 1:45 min
- Rollbacks: 2
```

---

## RESUMEN DE BUENAS PRÁCTICAS

### DO (Hacer)

1. **Usar previews para todos los PRs**

    - Revisar visualmente antes de merge
    - Compartir con stakeholders

2. **Automatizar todo**

    - Tests, linting, deployment
    - Menos intervención manual = menos errores

3. **Variables de entorno por ambiente**

    - Production, staging, development
    - Nunca hardcodear valores

4. **Monitorear proactivamente**

    - Error tracking, analytics, performance
    - Detectar problemas antes que los usuarios

5. **Documentar deployments**

    - Changelog actualizado
    - Release notes claras

6. **Proteger branch main**

    - Require PR reviews
    - Status checks obligatorios

7. **Optimizar performance**

    - Code splitting, lazy loading
    - Comprimir assets, caching efectivo

8. **Security first**

    - Security headers configurados
    - Dependencias actualizadas
    - Auditorías regulares

9. **Rollback plan siempre listo**

    - Un click en Amplify
    - Comunicación clara del proceso

10. **Comunicar cambios**
    - Notificar al equipo
    - Status page para usuarios

### DON'T (No hacer)

1. **No commitear secretos**

    - Usar variables de entorno
    - .gitignore configurado correctamente

2. **No deployar a producción sin testing**

    - Siempre usar preview deployments
    - Tests automatizados obligatorios

3. **No ignorar warnings de build**

    - Resolver todos los warnings
    - Bundle size matters

4. **No hardcodear URLs o configs**

    - Siempre usar variables de entorno
    - Flexibilidad entre ambientes

5. **No hacer hot-fixes directos a main**

    - Siempre PR + review
    - Proceso consistente

6. **No ignorar métricas de performance**

    - Lighthouse score < 90 = problema
    - Web Vitals importan

7. **No deployar sin comunicar**

    - Notificar al equipo
    - Downtime planificado comunicado

8. **No olvidar documentación**

    - README actualizado
    - Runbooks para incidentes

9. **No sobrecomplicar**

    - KISS principle
    - Simple es mejor que complejo

10. **No perder tiempo en configuración manual**
    - Amplify automatiza mucho
    - Aprovecha las features integradas

---

## CONCLUSIÓN

AWS Amplify para frontend SPA ofrece:

-   **CI/CD automático** out-of-the-box
-   **Preview deployments** para cada PR
-   **Rollback** con un click
-   **SSL gratuito** y automático
-   **CDN global** incluido
-   **Variables de entorno** por ambiente
-   **Monitoreo** integrado
-   **Precio competitivo** con plan gratuito generoso

**Para proyectos frontend modernos (SPAs), Amplify es la mejor opción en AWS** por su balance entre simplicidad, features y costo.

**Next steps:**

-   Practicar con proyecto propio
-   Explorar Amplify Functions para backend
-   Integrar con otros servicios AWS (Cognito, AppSync, etc.)
-   Implementar monitoreo avanzado
-   Optimizar costs y performance
