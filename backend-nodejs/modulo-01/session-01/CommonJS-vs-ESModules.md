# 📦 Ejemplos: CommonJS vs ES Modules en Node.js con TypeScript

## 🧩 Estructura de archivos común

```
project-root/
├── src/
│   ├── math.ts
│   └── index.ts
├── tsconfig.json
├── package.json
```

---

## 🧪 EJEMPLO 1: Uso de **CommonJS**

### 🔧 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true
  }
}
```

### 📄 src/math.ts

```ts
function sum(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

module.exports = { sum, multiply };
```

### 📄 src/index.ts

```ts
const math = require('./math');

console.log("Suma:", math.sum(2, 3));
console.log("Multiplicación:", math.multiply(4, 5));
```

### ▶️ Ejecutar

```bash
npx tsc
node dist/index.js
```

---

## 🧪 EJEMPLO 2: Uso de **ES Modules (ESM)**

### 🔧 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  }
}
```

### 🔧 package.json

```json
{
  "type": "module"
}
```

> Esto le indica a Node.js que los archivos JS deben interpretarse como ESM.

### 📄 src/math.ts

```ts
export function sum(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

### 📄 src/index.ts

```ts
import { sum, multiply } from './math.js';

console.log("Suma:", sum(10, 20));
console.log("Multiplicación:", multiply(6, 7));
```

> ⚠️ Al compilar con `tsc`, los imports deben terminar en `.js` para que funcionen con Node.js.

---

## 📊 Comparativa resumida

| Característica        | CommonJS (`require`)               | ESM (`import/export`)               |
|----------------------|-------------------------------------|-------------------------------------|
| Sintaxis             | `require()` / `module.exports`      | `import` / `export`                 |
| Soporte histórico    | Nativo en Node.js desde el inicio   | Estable desde Node.js v14+          |
| Resolución de módulos| Sincrónica                          | Asíncrona                           |
| Soporte en browser   | ❌ Solo con bundlers (ej: Webpack)  | ✅ Compatible directamente           |
| Compatibilidad con TS| Total                               | Requiere configuración específica   |
