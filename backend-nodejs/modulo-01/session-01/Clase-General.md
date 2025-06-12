## Clase 01 - Fundamentos de Node.js y su ecosistema

### ⏰ Duración
**1.5 horas** (1 hora de teoría + media hora de práctica guiada)

---

### 🌟 Objetivos

Al finalizar esta clase, el estudiante podrá:

- Comprender en profundidad qué es Node.js y cuál es su rol en el ecosistema moderno de desarrollo backend.
- Comparar su arquitectura con lenguajes tradicionales como Java, PHP o Python.
- Entender las diferencias entre JavaScript y TypeScript en el contexto de Node.js.
- Configurar un proyecto profesional con TypeScript y Node.js desde cero.
- Diferenciar y aplicar correctamente CommonJS y ES Modules.
- Usar `npm` o `yarn` para la gestión de dependencias y scripts de desarrollo.

---

### 📚 Contenido de la clase

1. Node.js: definición, arquitectura y ventajas
2. Comparativa Node.js vs lenguajes tradicionales
3. JavaScript vs TypeScript en backend
4. CommonJS vs ES Modules
5. Configuración inicial de un proyecto con TypeScript
6. Manejo de paquetes con npm/yarn

---

### 📚 Desarrollo de la clase

#### 1. Node.js: definición, arquitectura y ventajas

**Node.js** es un entorno de ejecución para JavaScript construido sobre el motor V8 de Chrome, creado en 2009 por Ryan Dahl. Se ejecuta fuera del navegador y permite construir aplicaciones de servidor con JavaScript/TypeScript.

##### Características principales:

- **Single-thread, Non-blocking I/O**: A diferencia de Java o PHP, Node.js usa un único hilo y un modelo basado en eventos.
- **Event Loop**: Delegación de operaciones pesadas (I/O) al sistema y uso de callbacks/promesas.
- **Alto rendimiento**: Gracias a V8 y a su arquitectura asíncrona.

##### Comparativa de rendimiento y concurrencia:

| Característica              | Node.js               | Java                    | PHP              |
|-----------------------------|------------------------|-------------------------|------------------|
| Modelo de concurrencia      | Event Loop + Callbacks| Multi-thread con hilos | Basado en procesos |
| Velocidad de inicio         | Muy rápido             | Lento (JVM)             | Rápido           |
| Consumo de memoria          | Bajo                   | Alto                    | Bajo              |
| Escalabilidad               | Alta (microservicios)  | Alta (monolitos)        | Limitada          |

---

#### 2. JavaScript vs TypeScript en backend

JavaScript es dinámico, sin tipado estático, mientras que **TypeScript** es un superset que añade tipado estático opcional, interfaces, enums, tipos genéricos y otras herramientas para arquitecturas robustas.

##### Comparativa de ventajas:

| Elemento              | JavaScript                        | TypeScript                                |
|-----------------------|------------------------------------|-------------------------------------------|
| Tipado                | Dinámico                         | Estático y opcional                       |
| Autocompletado IDE    | Limitado                          | Avanzado (gracias a tipos)                |
| Escalabilidad         | Difícil de mantener               | Ideal para proyectos grandes              |
| Curva de aprendizaje  | Baja                              | Media                                     |
| Errores en tiempo     | En ejecución                     | En compilación                            |

##### Ejemplo práctico:

**JavaScript**
```js
function sum(a, b) {
  return a + b;
}
```

**TypeScript**
```ts
function sum(a: number, b: number): number {
  return a + b;
}
```

---

#### 3. CommonJS vs ES Modules

Node.js soporta dos sistemas de módulos:

- **CommonJS (CJS)**: Sistema tradicional de Node (`require`, `module.exports`)
- **ECMAScript Modules (ESM)**: Estándar moderno de JavaScript (`import`, `export`)

##### Comparativa:

| Característica           | CommonJS                   | ES Modules                     |
|--------------------------|-----------------------------|---------------------------------|
| Sintaxis                 | require/module.exports      | import/export                  |
| Resolución              | Sincrónica                  | Asíncrona                      |
| Soporte en TypeScript    | Total                       | Requiere `module: "ESNext"`    |
| Uso en frontend          | No                          | Sí                            |

##### Ejemplo:
**CommonJS**
```js
const fs = require('fs');
```

**ESM** (en TypeScript con `module: "ESNext"`)
```ts
import fs from 'fs';
```

---

#### 4. Configuración inicial de un proyecto con TypeScript

Pasos:

```bash
mkdir backend-app && cd backend-app
npm init -y
npm install typescript ts-node-dev @types/node --save-dev
npx tsc --init
```

Editar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "rootDir": "src",
    "outDir": "dist",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

#### 5. Manejo de paquetes con npm/yarn

**npm** es el gestor de paquetes oficial de Node.js. **yarn** es una alternativa más rápida en instalaciones y con mejor manejo de dependencias.

##### Comandos comunes:

```bash
npm install express
npm install --save-dev typescript
npm uninstall express
yarn install
yarn add express
yarn remove express
```

##### Scripts en package.json:

```json
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

---

### 💻 Ejemplo práctico guiado

1. Crear carpeta `src/`
2. Archivo `src/index.ts`:

```ts
import express from 'express';

const app = express();
app.get('/', (req, res) => res.send('Hola desde TypeScript'));

app.listen(3000, () => console.log('Servidor iniciado en http://localhost:3000'));
```

3. Ejecutar:
```bash
npm run dev
```

---

### 📝 Conclusión

- Node.js ofrece un entorno moderno, eficiente y ligero para desarrollo backend.
- Comparado con lenguajes tradicionales, es altamente escalable y con bajo consumo de recursos.
- TypeScript mejora la robustez del código, facilitando la escalabilidad de aplicaciones.
- La elección entre CommonJS y ES Modules depende del entorno y las herramientas.
- Un proyecto profesional inicia con una buena configuración de `tsconfig.json` y scripts de desarrollo.