# Proyectos Finales – Curso Backend con Node.js

A continuación se presentan dos proyectos propuestos como evaluación final del curso. Cada proyecto cuenta con dos niveles de complejidad: **Nivel Normal** (mínimo requerido para aprobar) y **Nivel Avanzado** (para estudiantes que deseen demostrar un dominio técnico superior).

---

## Proyecto 1: Plataforma de Gestión de Eventos – *Evently Backend*

### Descripción General

Una API RESTful para gestionar eventos públicos o privados. Permite a los organizadores publicar eventos, a los asistentes inscribirse y recibir notificaciones en tiempo real cuando ocurren cambios relevantes (nivel avanzado).

---

### ✅ Nivel Normal

#### Funcionalidades

- Registro y login con JWT (roles: `admin`, `organizer`, `attendee`).
- CRUD de eventos (solo organizadores o admins pueden crearlos).
- Inscripción de usuarios en eventos disponibles.
- Consulta de eventos públicos disponibles.
- Swagger con toda la documentación de endpoints.
- Docker Compose con PostgreSQL/Mysql.

#### Endpoints principales

```
POST   /auth/register         # Registro de usuario
POST   /auth/login            # Login y generación de token JWT
GET    /events                # Listado público de eventos
GET    /events/:id            # Detalle de evento
POST   /events                # Crear evento (solo organizer/admin)
PUT    /events/:id            # Actualizar evento (solo organizer/admin)
DELETE /events/:id            # Eliminar evento (solo organizer/admin)
POST   /events/:id/subscribe  # Inscribirse a un evento
```

#### Modelo de Base de Datos

- **users** (id, name, email, password\_hash, role)
- **events** (id, title, description, location, date, created\_by)
- **event\_subscriptions** (id, user\_id, event\_id, subscribed\_at)

Relaciones:

- `users.role`: enum [`admin`, `organizer`, `attendee`]
- `events.created_by` → `users.id`
- `event_subscriptions.user_id` → `users.id`
- `event_subscriptions.event_id` → `events.id`

#### Diagrama C4 - Nivel Normal

##### Nivel 1: Diagrama de Contexto

- Usuario interactúa con una API de gestión de eventos.
- El sistema ofrece autenticación, consulta y suscripción a eventos.

##### Nivel 2: Diagrama de Contenedores

- **Frontend externo (opcional)** → realiza peticiones HTTP a:
  - **API Backend Node.js (NestJS/Koa)** → maneja lógica de negocio, roles, suscripción.
  - **Base de datos PostgreSQL/Mysql** → almacena usuarios, roles y eventos.

##### Nivel 3: Diagrama de Componentes

- AuthController: login, register
- EventController: endpoints públicos y protegidos
- AuthService: generación y validación de JWT
- EventService: lógica de creación, consulta y suscripción
- TypeORM como capa de acceso a datos

##### Nivel 4: Diagrama de Código

- Controladores definidos por rutas
- DTOs validados con class-validator
- JWT Middleware y guards
- Repositorios TypeORM con relaciones entre entidades

---

### 🚀 Nivel Avanzado

#### Funcionalidades adicionales

- Notificaciones en tiempo real vía WebSocket cuando se edita o cancela un evento.
- Cache de eventos populares con Redis.
- Logs estructurados con Winston.
- Seeders y migraciones TypeORM.
- Pruebas unitarias de los servicios principales con Jest.
- Autenticación basada en **Access Token (12h)** y **Refresh Token (7 días)**.
- Endpoint para revocar tokens (`/auth/logout`) utilizando Redis como blacklist de refresh tokens.

#### Endpoints adicionales

```
POST   /auth/refresh-token          # Renovar tokens
POST   /auth/logout                 # Revocar tokens y cerrar sesión
GET    /notifications/ws            # Conexión WebSocket para recibir notificaciones
```

#### Lógica del WebSocket

- El cliente se conecta a `/notifications/ws`.
- El servidor emite eventos del tipo `event-updated` o `event-cancelled` con el ID del evento.
- Solo usuarios inscritos al evento reciben las notificaciones.

#### Diagrama C4 - Nivel Avanzado

##### Nivel 1: Diagrama de Contexto

- Usuario accede a funcionalidades extendidas con notificaciones en tiempo real.

##### Nivel 2: Diagrama de Contenedores

- Backend API + WebSocket (Node.js + (NestJS/Koa) + ws/socket.io)
- Redis para cache de eventos populares y tokens revocados
- PostgreSQL/Mysql como base persistente

##### Nivel 3: Diagrama de Componentes

- NotificationGateway: gestión de suscripciones WebSocket
- RedisService: lectura/escritura de datos populares y tokens revocados
- LoggerService: Winston centralizado
- AuthService: manejo de access/refresh tokens y logout
- TestService: pruebas con Jest de servicios aislados

##### Nivel 4: Diagrama de Código

- Implementación de socket-server separado del HTTP server
- Middleware para validar access token y refresh token
- Logout con revocación en Redis
- Servicios desacoplados con inyección de dependencias
- Unit testing por servicio y controlador

---

## Proyecto 2: API de Reservas de Taxi – *TaxiGo API*

### Descripción General

Una API para pasajeros que solicitan taxis, y conductores que aceptan o completan viajes. Se gestiona el flujo del estado del viaje y, en el nivel avanzado, se incluye WebSocket y simulación de ubicación GPS.

---

### ✅ Nivel Normal

#### Funcionalidades

- Registro y login con JWT (roles: `passenger`, `driver`).
- Solicitud de viaje (creación por parte del pasajero).
- Aceptación del viaje (por un conductor).
- Flujo de estado del viaje: `requested -> accepted -> on_ride -> completed`.
- Consulta de historial de viajes por usuario.
- Docker Compose con PostgreSQL/Mysql y documentación Swagger.

#### Endpoints principales

```
POST   /auth/register            # Registro de usuario
POST   /auth/login               # Login y generación de token JWT
POST   /travels/request          # Pasajero solicita un viaje
POST   /travels/:id/accept       # Conductor acepta el viaje
POST   /travels/:id/start        # Conductor inicia el viaje
POST   /travels/:id/complete     # Conductor finaliza el viaje
POST   /travels/:id/cancel       # Cancelar viaje (conductor o pasajero)
GET    /me/travels               # Consultar mis viajes
```

#### Modelo de Base de Datos

- **users** (id, name, email, password\_hash, role)
- **travels** (id, passenger\_id, driver\_id, origin, destination, status, created\_at, updated\_at)

Relaciones:

- `users.role`: enum [`passenger`, `driver`]
- `travels.passenger_id` → `users.id`
- `travels.driver_id` → `users.id` (puede ser NULL hasta que sea aceptado)

#### Diagrama C4 - Nivel Normal

##### Nivel 1: Diagrama de Contexto

- Pasajero y conductor acceden a funcionalidades de viaje por separado.

##### Nivel 2: Diagrama de Contenedores

- Backend Node.js expone API REST
- PostgreSQL almacena viajes, usuarios y estados

##### Nivel 3: Diagrama de Componentes

- TravelController: rutas protegidas por rol
- TravelService: lógica del cambio de estado
- AuthService y DTOs para validación y login
- TypeORM para persistencia

##### Nivel 4: Diagrama de Código

- Entidades: User, Travel con relaciones y enums para estado
- Guards para roles
- Servicios con lógica desacoplada por caso de uso

---

### 🚀 Nivel Avanzado

#### Funcionalidades adicionales

- WebSocket para actualizar en tiempo real el estado del viaje.
- Redis para almacenar y consultar viajes activos.
- Simulación de GPS: cada 5 segundos se actualiza la ubicación del conductor.
- Seeders para usuarios y conductores de prueba.
- Logger con Winston.
- Pruebas unitarias del flujo completo con Jest.
- Autenticación basada en **Access Token (12h)** y **Refresh Token (7 días)**.
- Endpoint para revocar tokens (`/auth/logout`) utilizando Redis como blacklist de refresh tokens.

#### Endpoints adicionales

```
POST   /auth/refresh-token          # Renovar tokens
POST   /auth/logout                 # Revocar tokens y cerrar sesión
GET    /ws/travels/:id/status       # WebSocket: suscribirse al estado de un viaje
```

#### Lógica del WebSocket

- Cliente (pasajero o conductor) se conecta a `/ws/travels/:id/status`.
- El backend emite eventos con el nuevo estado del viaje y coordenadas del conductor.
- La simulación de movimiento actualiza coordenadas cada 5 segundos.

#### Diagrama C4 - Nivel Avanzado

##### Nivel 1: Diagrama de Contexto

- Comunicación en tiempo real entre pasajero y conductor mediante WebSocket

##### Nivel 2: Diagrama de Contenedores

- Backend REST + WebSocket server (Node.js)
- Redis para estado activo de viajes, cache y tokens revocados
- PostgreSQL/Mysql para datos históricos

##### Nivel 3: Diagrama de Componentes

- TravelGateway (WebSocket)
- GpsSimulatorService
- RedisService
- LoggerService (Winston)
- AuthService: manejo de access/refresh tokens y logout
- TravelService modularizado con pruebas unitarias

##### Nivel 4: Diagrama de Código

- Eventos socket `travel-update`, `position-update`
- Jobs de simulación de posición con setInterval
- Middleware para validar access token y refresh token
- Logout con revocación en Redis
- Estructura de logs en JSON + tracing opcional con traceId

---

## Recomendaciones generales para ambos proyectos

- Utilizar TypeScript en todo el backend.
- Aplicar DTOs y validaciones con `class-validator`.
- Aplicar principios de arquitectura limpia en la medida posible.
- Asegurar protección de rutas con JWT.
- Implementar flujo de login con refresh token y revocación con Redis.
- Documentar todos los endpoints con Swagger.
- Incluir un `README.md` con instrucciones de instalación y prueba local.

