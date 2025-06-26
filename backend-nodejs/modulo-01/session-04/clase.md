# SESIÓN 4 – HERRAMIENTAS DE DESARROLLO Y DEBUGGING

---

## 🎯 Objetivo de la clase

Al finalizar esta sesión, el estudiante será capaz de:

- Configurar y utilizar herramientas modernas que optimizan el desarrollo backend con Node.js y TypeScript.
- Depurar aplicaciones de forma eficiente desde el entorno de desarrollo (VS Code).
- Implementar registros estructurados de logs para seguimiento y monitoreo de errores.
- Aplicar buenas prácticas que faciliten la mantenibilidad del código en proyectos Node.js.

---

## 📚 Contenido de la clase

1. Introducción al desarrollo eficiente en Node.js
2. Uso de herramientas como `nodemon` y `ts-node`
3. Debugging con Visual Studio Code
4. Logs estructurados con Winston y monitoreo con Debug
5. Mejores prácticas de desarrollo en entornos reales

---

## 1️⃣ Introducción al desarrollo eficiente en Node.js

### 💡 ¿Por qué usar herramientas?

Durante el desarrollo, necesitamos automatizar tareas, reiniciar servidores, inspeccionar errores y organizar el flujo de ejecución del código. Herramientas como `nodemon`, `ts-node`, y sistemas de logging como `winston` y `debug` ayudan a profesionalizar el proceso.

---

## 2️⃣ Uso de herramientas: `nodemon` y `ts-node`

### 🧠 Concepto

- **`nodemon`**: reinicia tu servidor automáticamente cada vez que detecta un cambio en tu código. Ideal para desarrollo continuo.
- **`ts-node`**: ejecuta directamente archivos `.ts` sin necesidad de compilar manualmente con `tsc`.

### 🧪 Caso de uso: Reinicio automático en desarrollo

Un backend de API en Node.js necesita estar escuchando cambios en tiempo real sin reiniciar manualmente.

### 🛠️ Instalación y configuración

```bash
npm install --save-dev ts-node nodemon typescript
```

#### `package.json`

```json
"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/index.ts"
}
```

#### `nodemon.json` (opcional)

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/index.ts"
}
```

#### `tsconfig.json` (parcial)

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

---

## 3️⃣ Debugging con Visual Studio Code

### 🧠 Concepto

**Debuggear** es ejecutar tu código paso a paso para observar el comportamiento de variables, errores o condiciones que afectan la lógica.

### 🧪 Caso de uso: Inspeccionar errores en producción simulados

Tenemos un bug en una función que formatea datos. Necesitamos inspeccionar el valor de entrada en tiempo real.

### 🧰 Configuración del debugger en `launch.json`

1. Ir a la pestaña "Run and Debug" en VS Code.
2. Crear un archivo `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TS App",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/index.ts"]
    }
  ]
}
```

### 🧪 Ejemplo en código

```ts
function formatUserData(user: any): string {
  console.log('formateando datos...');
  return `Nombre: ${user.name}, Edad: ${user.age}`;
}

formatUserData({ name: 'Jorge', age: 30 });
```

---

## 4️⃣ Logs y monitoreo con Winston y Debug

### 🧠 Concepto

- **Winston** permite crear registros estructurados y transportarlos a consola, archivos o servicios de monitoreo.
- **Debug** ofrece una forma sencilla de mostrar logs durante desarrollo, activables con variables de entorno.

### 🧪 Caso de uso: Registrar errores y flujos del sistema

Cuando una API falla o se ejecuta un proceso crítico (como login, envío de correo o proceso de pago), necesitamos dejar rastro para auditar y corregir.

### 🛠️ Instalación

```bash
npm install winston debug
```

### 📄 Ejemplo: Winston

#### `logger.ts`

```ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()]
});
```

#### Uso

```ts
import { logger } from './logger';

logger.info('Iniciando el servidor...');
logger.error('Error al conectar con la base de datos');
```

### 📄 Ejemplo: Debug

#### `authService.ts`

```ts
const debug = require('debug')('app:auth');

export function login(user: string) {
  debug(`Usuario intentando login: ${user}`);
}
```

#### Activación

```bash
DEBUG=app:* npm run dev
```

---

## 5️⃣ Mejores prácticas en desarrollo con Node.js

### 📌 Conceptos y ejemplos

| Práctica                   | Descripción                                         | Ejemplo                                |
|----------------------------|-----------------------------------------------------|----------------------------------------|
| Separación de responsabilidades | Evitar archivos gigantes con múltiples responsabilidades. | Usar controladores, servicios y rutas separados |
| Manejo de errores          | Siempre capturar errores asíncronos.               | `try/catch + async/await`              |
| Uso de `.env`              | Configuración por entorno.                         | `.env.dev`, `.env.prod`                |
| Logging estructurado       | Siempre loguear con formato legible y niveles.     | Usar `winston`                         |
| Linter y formateo          | Código uniforme para todo el equipo.               | Usar `eslint`, `prettier`              |

---

## 💻 Actividad práctica guiada

### 💡 Enunciado

Crear un proyecto simple que:

1. Lea un archivo JSON con datos de usuario.
2. Formatee los datos.
3. Use Winston para loguear cada paso.
4. Permita debuggeo paso a paso en VS Code.
5. Use Debug para trazar eventos internos.

---

### 🧩 Archivos:

#### `src/index.ts`

```ts
import { readFile } from 'fs/promises';
import { logger } from './logger';
const debug = require('debug')('app:read');

async function readUserData() {
  try {
    debug('Iniciando lectura de archivo');
    const data = await readFile('./data/user.json', 'utf-8');
    const user = JSON.parse(data);
    logger.info(`Usuario leído: ${user.name}`);
  } catch (err) {
    logger.error('Error al leer usuario: ' + err);
  }
}

readUserData();
```

#### `data/user.json`

```json
{
  "name": "Jorge",
  "age": 30
}
```

---

## 📌 Conclusión

- Las herramientas modernas son indispensables para desarrollar con eficiencia y calidad.
- El debugging profesional ahorra horas de trabajo en etapas tempranas.
- Registrar logs es vital en ambientes de producción.
- Aplicar buenas prácticas desde el día uno mejora la escalabilidad del proyecto.
