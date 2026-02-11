# Proyectos Finales – Curso Frontend Web con Vue.js

A continuación se presentan dos proyectos propuestos como evaluación final del curso. Cada proyecto cuenta con dos niveles de complejidad: **Nivel Normal** (mínimo requerido para aprobar) y **Nivel Avanzado** (para estudiantes que deseen demostrar un dominio técnico superior).

Los proyectos están orientados a construir una **aplicación web SPA** con Vue 3 y TypeScript, aplicando **componentes**, **Vue Router**, **Pinia**, **Composition API**, integración con **APIs REST**, autenticación/autorización en el frontend y **despliegue en producción** (Vercel/Netlify/Firebase Hosting).

---

## Proyecto 1: Plataforma SPA de Gestión de Eventos – _Evently Web_

### Descripción General

Aplicación SPA para gestionar eventos públicos o privados. Permite a organizadores crear y administrar eventos, y a asistentes descubrir e inscribirse; en el nivel avanzado se agregan actualizaciones en tiempo real (API/Real time).

---

### ✅ Nivel Normal

#### Funcionalidades (Frontend)

- Estructura del proyecto con **Vue 3 + TypeScript** y enfoque SPA.
- UI de autenticación: registro/login e integración con API mediante **Axios**.
- Manejo de sesión en frontend (por ejemplo, guardar token en LocalStorage/SessionStorage y control de expiración).
- Navegación con **Vue Router**: rutas públicas/privadas, guards y lazy loading en vistas.
- Estado global con **Pinia**: usuario autenticado, listado de eventos, suscripciones, etc.
- Vistas principales:
- Listado público de eventos.
- Detalle de evento.
- Panel de organizador (crear/editar/eliminar eventos).
- Mis inscripciones (asistente).
- Validaciones de formularios (crear evento, login, registro) y manejo de errores (UI/UX).

#### Requisitos técnicos mínimos

- Uso de Composition API (composables para auth, api-client, etc.).
- Manejo consistente de estados: loading, empty, error, success.
- Documentación en `README.md`: instalación, variables de entorno, scripts y URL del deploy.

---

### 🚀 Nivel Avanzado

#### Funcionalidades adicionales

- Comunicación **Api/Real time** para notificaciones o cambios (ej.: “evento actualizado/cancelado” reflejado en tiempo real en la UI).
- Control de acceso más completo: roles/permisos en UI (ej.: mostrar/ocultar acciones según rol) y guards por rol.
- Persistencia avanzada del estado (ej.: rehidratación de sesión) y estrategia de refresh token si la API lo soporta.
- Preparación para producción con **Vite** (env vars, build optimizado) y despliegue en **Vercel/Netlify/Firebase Hosting**.

---

## Proyecto 2: SPA de Reservas de Taxi – _TaxiGo Web_

### Descripción General

Aplicación SPA para pasajeros y conductores. El pasajero solicita un viaje y el conductor lo acepta; la UI refleja el flujo de estados del viaje, y en el nivel avanzado se actualiza en tiempo real.

---

### ✅ Nivel Normal

#### Funcionalidades (Frontend)

- Vue 3 + TypeScript SPA con arquitectura por módulos (views/components/composables/stores).
- Autenticación en frontend y consumo de endpoints REST (Axios) con manejo de errores.
- Vue Router con rutas protegidas (pasajero vs conductor) y guards.
- Pinia para estado global:
- Sesión de usuario.
- Viaje actual.
- Historial de viajes.
- Flujo UI del viaje: `requested -> accepted -> on_ride -> completed` (según lo que exponga la API).
- Formularios validados (solicitar viaje) y estrategia de errores global (interceptor + mensajes en UI).

---

### 🚀 Nivel Avanzado

#### Funcionalidades adicionales

- Tiempo real (Api/Real time): actualización del estado del viaje en vivo y/o posición simulada si la API la provee.
- UX avanzada:
- Estados offline/reintento.
- Skeletons y optimización de carga.
- Seguridad en frontend:
- Protección de rutas y sesiones.
- Manejo de tokens (access/refresh) si aplica.
- Observabilidad básica: captura de errores de runtime y registro controlado para debugging en producción.
- Build con Vite y despliegue en Vercel/Netlify/Firebase Hosting.

---

## Recomendaciones generales (para ambos proyectos)

- Construir con enfoque práctico una aplicación SPA aplicando **Componentes**, **Vue Router**, **Pinia**, **Composition API** y consumo de **APIs REST**.
- Implementar autenticación/autorización en frontend (JWT), protección de rutas/sesión y gestión de roles/permisos a nivel UI.
- Aplicar validaciones, manejo global de errores y buenas prácticas de debugging (Devtools).
- Optimizar y desplegar a producción con Vite y un proveedor cloud (Vercel/Netlify/Firebase Hosting).

---

## Criterios de evaluación

- Examen online por módulo: **40%**.
- Presentación del proyecto final: **40%**.
- Asistencia a clases en vivo: **20%**.
