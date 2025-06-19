
# 📦 Diferencias entre npm y pnpm

## Comparación general

| Característica              | `npm` (Node Package Manager)              | `pnpm` (Performant NPM)                          |
|----------------------------|-------------------------------------------|--------------------------------------------------|
| 🚀 **Velocidad**             | Moderada                                 | Muy rápida (usa caching inteligente y enlaces)   |
| 🧠 **Uso de espacio**        | Duplica dependencias por proyecto         | Comparte paquetes entre proyectos (sin duplicados) |
| 🔁 **Instalación**           | Copia cada dependencia en `node_modules` | Usa *symlinks* desde una caché global local      |
| 📁 **node_modules**          | Grande y anidado                         | Compacto y plano (sin conflictos de versiones)   |
| ✅ **Integridad**            | Usa `package-lock.json`                  | Usa `pnpm-lock.yaml` para más precisión          |
| 🔄 **Instalaciones paralelas** | Limitadas                               | Muy eficientes y paralelizadas                   |
| 🌐 **Soporte oficial**       | Oficial de Node.js                       | Compatible con npm registry                      |
| 🧩 **Plug-and-play (experimental)** | No                                   | Sí, con `nodeLinker=hoisted` o `isolated`       |

---

## 📝 Comandos equivalentes

| Acción                     | `npm`                      | `pnpm`                      |
|---------------------------|----------------------------|-----------------------------|
| Instalar dependencias     | `npm install`              | `pnpm install`              |
| Instalar una dependencia  | `npm install axios`        | `pnpm add axios`            |
| Instalar dev dependencia  | `npm install -D eslint`    | `pnpm add -D eslint`        |
| Ejecutar script           | `npm run start`            | `pnpm start`                |
| Actualizar paquetes       | `npm update`               | `pnpm update`               |

---

## 🟢 ¿Cuál conviene usar?

- Usa **`npm`** si necesitas compatibilidad universal y no quieres instalar nada nuevo.
- Usa **`pnpm`** si te importa el rendimiento, el uso eficiente del disco y la rapidez de instalación, especialmente en **monorepos o proyectos grandes**.
