# Uso de Variables de Entorno y Git Flow en Proyectos con Vite

## ¿Qué son las variables de entorno?

Las **variables de entorno** (`environment variables`) son valores externos al código fuente que afectan el comportamiento de la aplicación.

### Ejemplos comunes

- URLs de APIs
- Claves secretas
- Colores, mensajes y configuración visual
- Modo de ejecución: desarrollo, pruebas, producción

Permiten separar la **configuración** del **código fuente**, siguiendo buenas prácticas como las del [12-Factor App](https://12factor.net/).

---

## ¿Cómo se usan en Vite?

### Archivos soportados por Vite:

| Archivo            | Usado para...                     |
| ------------------ | --------------------------------- |
| `.env`             | Común a todos los entornos        |
| `.env.development` | Modo desarrollo (`npm run dev`)   |
| `.env.production`  | Modo producción (`npm run build`) |

### Ejemplo de `.env.development`

```env
VITE_API_URL=http://localhost:3000
VITE_PRIMARY_COLOR=#409EFF
```

### En tu código Vue:

```ts
const api = import.meta.env.VITE_API_URL;
```

> ⚠️ Todas las variables deben comenzar con `VITE_` para que sean accesibles desde el frontend.

---

## ¿Cómo se trabaja con esto en equipo?

### Buenas prácticas:

1. No subir archivos `.env` reales al repositorio.
2. Crear y mantener actualizado un archivo `.env.example`.
3. Agregar `.env.*` al `.gitignore`:

```gitignore
.env*
!.env.example
```

### Flujo típico para cada miembro del equipo:

- Clona el repositorio
- Copia `.env.example` a `.env.development`
- Llena sus propios valores locales

---

## `.env.example` típico

```env
VITE_API_URL=
VITE_PRIMARY_COLOR=
VITE_GOOGLE_MAPS_API_KEY=
```

---

## Git Flow y relación con entornos

**Git Flow** es una estrategia de ramificación:

```plaintext
main
│
├─ develop
│   ├─ feature/*
│   └─ release/*
└─ hotfix/*
```

### Relación con entornos:

| Rama        | Entorno            | Variables de entorno   |
| ----------- | ------------------ | ---------------------- |
| `develop`   | Desarrollo (`dev`) | `.env.development`     |
| `release/*` | QA / staging       | `.env.qa`, `.env.test` |
| `main`      | Producción         | `.env.production`      |
| `hotfix/*`  | Producción         | `.env.production`      |

---

## Scripts típicos en `package.json`

```json
"scripts": {
  "dev": "vite --mode development",
  "build:dev": "vite build --mode development",
  "build:qa": "vite build --mode qa",
  "build": "vite build --mode production"
}
```

---

## Buenas prácticas generales

- Mantener un `.env.example` sincronizado con el código
- No subir nunca claves sensibles
- Documentar claramente cada variable
- Usar `--mode` en scripts de build
- Automatizar todo en CI/CD (GitHub Actions, GitLab CI, etc.)

---

## Recomendación adicional

Agregar una sección en el `README.md` de tu repositorio para que el equipo sepa cómo configurar su entorno local correctamente.
