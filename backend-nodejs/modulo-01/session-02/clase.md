
# Clase 02 – Arquitectura de un Backend Moderno

## ⏱️ Duración
**1 hora 30 minutos**

## 🎯 Objetivo

Comprender los principios fundamentales que definen una arquitectura backend moderna. Esto incluye buenas prácticas de escalabilidad, estructura modular del proyecto, comprensión de patrones de diseño generales y su aplicación en Node.js, además del uso correcto de configuraciones y variables de entorno.

## 📚 Contenido

1. Principios de una arquitectura escalable  
2. Estructura de carpetas y modularidad  
3. Introducción a patrones de diseño (generales y en Node.js)  
4. Gestión de configuración y variables de entorno

---

## 1️⃣ Principios de una arquitectura escalable

### ✅ ¿Qué significa que una arquitectura sea escalable?

Una arquitectura escalable permite que el sistema crezca sin perder rendimiento ni estabilidad, ya sea agregando nuevas funcionalidades, aumentando usuarios o procesamiento de datos.

| Principio                        | Descripción |
|----------------------------------|-------------|
| Separación de responsabilidades  | Cada módulo tiene una única función clara |
| Bajo acoplamiento                | Los módulos no dependen fuertemente entre sí |
| Alta cohesión                    | Funciones dentro de un módulo están bien relacionadas |
| Inversión de dependencias        | Capas superiores no dependen directamente de las inferiores |
| Observabilidad                   | Facilidad para monitorear, rastrear y alertar |

---

## 2️⃣ Estructura de carpetas y modularidad

### 📦 Estructura modular sugerida

```bash
src/
├── config/
├── common/
├── modules/
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.repository.ts
│       └── user.dto.ts
├── middleware/
├── routes/
└── main.ts
```

| Enfoque tradicional        | Enfoque modular moderno |
|---------------------------|--------------------------|
| Todo junto                | Separación por dominio |
| Poco escalable            | Facilita el crecimiento |
| Difícil de testear        | Reutilizable y probable |

---

## 3️⃣ Introducción a patrones de diseño

### 🧱 ¿Qué es un patrón de diseño?

Una **solución probada** a problemas comunes de diseño de software. Se clasifican en tres grandes tipos:

| Tipo              | Descripción |
|-------------------|-------------|
| **Creacionales**   | Cómo se crean los objetos |
| **Estructurales**  | Cómo se relacionan las clases y objetos |
| **De comportamiento** | Cómo interactúan los objetos entre sí |

### 🎯 Patrones generales más comunes

| Patrón        | Tipo              | Descripción | Ejemplo práctico |
|---------------|-------------------|-------------|------------------|
| Singleton     | Creacional        | Una única instancia global | Logger, config |
| Factory       | Creacional        | Crear objetos según condiciones | Adapter para bases de datos |
| Adapter       | Estructural       | Unifica interfaces incompatibles | Traducir respuesta de una API externa |
| Strategy      | Comportamiento    | Intercambiar algoritmos en tiempo de ejecución | Métodos de pago |
| Observer      | Comportamiento    | Notificación reactiva entre objetos | WebSockets o eventos |
| Decorator     | Estructural       | Añade funcionalidades sin modificar la clase | Middlewares (auth, logs) |

---

### 🔁 ¿Cuáles se usan recurrentemente en Node.js?

#### 1. Singleton Pattern

```ts
class Logger {
  private static instance: Logger;
  private constructor() {}
  static getInstance() {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  log(msg: string) {
    console.log(msg);
  }
}
export const logger = Logger.getInstance();
```

#### 2. Factory Pattern

```ts
import { createMySQLConnection } from './mysql';
import { createPostgresConnection } from './postgres';

export function createDBAdapter(type: 'mysql' | 'postgres') {
  if (type === 'mysql') return createMySQLConnection();
  if (type === 'postgres') return createPostgresConnection();
}
```

#### 3. Service Layer Pattern

```ts
export const createUser = async (data) => {
  return userRepository.save(data);
};
```

#### 4. Repository Pattern

```ts
export const findAll = () => db.query('SELECT * FROM users');
```

#### 5. Middleware Pattern

```ts
export const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send('Unauthorized');
  next();
};
```

#### 6. Dependency Injection (DI)

```ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
```

---

## 4️⃣ Gestión de configuración y variables de entorno

### 🛠️ Herramientas

- `.env` + `dotenv`
- Validadores como `joi`, `zod`
- `dotenv-safe` para validar variables requeridas

### 💼 Ejemplo

```env
PORT=3000
DB_URL=mysql://user:pass@localhost:3306/app
```

```ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
};
```

| Recomendación               | Motivo |
|----------------------------|--------|
| No subir `.env`            | Contiene secretos |
| Usar `.env.example`        | Facilita onboarding de nuevos devs |
| Validar configuración      | Evita errores en producción |

---

## 🧪 Ejercicio práctico

Implementar un módulo `user` siguiendo arquitectura modular y patrón service + repository. Usar `.env` para configurar puerto y base de datos.

1. Crear estructura `modules/user`
2. Separar controller, service, repository
3. Configurar `.env`
4. Implementar endpoint `GET /users` con datos de prueba
