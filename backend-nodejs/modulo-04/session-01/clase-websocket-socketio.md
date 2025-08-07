# Clase – Comunicación en Tiempo Real con WebSocket y Socket.IO

## Objetivos

Al finalizar esta clase, el estudiante será capaz de:

- Explicar el funcionamiento de **WebSocket** a nivel de protocolo (handshake, frames, full‑duplex).
- Diferenciar **WebSocket** de **Socket.IO** (qué agrega, cuándo conviene).
- Seleccionar la tecnología correcta según **casos de uso** y **limitaciones**.
- Identificar retos de **escalabilidad** y **observabilidad** en tiempo real.
- Diseñar el **flujo de autenticación** con JWT para conexiones persistentes.
- Implementar un **hello‑chat** en **NestJS** con **WebSocket puro** y con **Socket.IO**.

## Contenido

1. Contexto: del request/response al tiempo real  
2. WebSocket: qué es, cómo funciona  
3. Casos de uso y limitaciones de WebSocket  
4. Socket.IO: qué resuelve sobre WebSocket  
5. Casos de uso y limitaciones de Socket.IO  
6. Comparativa práctica WebSocket vs Socket.IO  
7. Arquitectura, escalado, observabilidad y seguridad  
8. Ejemplo NestJS – **WebSocket puro** (ws)  
9. Ejemplo NestJS – **Socket.IO**  
10. Recomendaciones finales

---

## 1) Contexto: del request/response al tiempo real

El modelo HTTP clásico (request → response) no permite **push** del servidor al cliente. Históricamente se usaron **polling** y **long‑polling** como paliativos. **WebSocket** habilita un **canal bidireccional persistente** sobre una única conexión TCP. **Socket.IO** se apoya (y extiende) en ese canal para ofrecer reconexión, rooms, namespaces y fallbacks.

---

## 2) WebSocket: qué es y cómo funciona

**WebSocket (RFC 6455)** establece una **conexión full‑duplex y persistente** entre cliente y servidor.

- **Handshake**: empieza como HTTP con `Upgrade: websocket` y respuesta `101 Switching Protocols`.
- **Frames**: tras el upgrade, el intercambio usa frames ligeros (texto/binario).
- **Bidireccional**: cliente y servidor pueden enviar mensajes en cualquier momento.
- **Full‑duplex**: lectura/escritura simultánea.
- **Bajo overhead** tras el handshake (ideal para alta frecuencia/latencia baja).

---

## 3) WebSocket – Casos de uso y limitaciones

### Casos de uso (WebSocket **puro**)
- **Trading/mercados**: ticks y libros de órdenes de alta frecuencia.
- **Juegos multijugador**: latencia mínima y control fino del protocolo.
- **Colaboración en tiempo real**: editores compartidos con operaciones frecuentes.
- **Telemetría/IoT**: streams binarios ligeros, dispositivos persistentes.
- **Dashboards críticos**: monitorización con miles de actualizaciones por segundo.

### Limitaciones (WebSocket **puro**)
- **Reconexión**: no viene “de fábrica” (debes implementarla tú).
- **Fallback**: si WS falla (proxy/firewall), no hay transporte alterno.
- **Rooms/Namespaces**: no existen nativamente (hay que crearlos).
- **Escalabilidad**: necesitas **sticky sessions** y **pub/sub** (Redis, NATS) para fan‑out.
- **Compatibilidad**: algunos entornos corporativos bloquean conexiones persistentes.
- **Gestión de backpressure**: debes controlar que el servidor no se desborde.

Cuándo preferir **WebSocket puro**: cuando necesitas **máximo rendimiento**, **protocolo personalizado**, **control total** y overhead mínimo.

---

## 4) Socket.IO: qué es y qué resuelve

**Socket.IO** es una **librería** (no un estándar) que usa WebSocket cuando puede y agrega:

- **Reconexión automática** + **exponencial backoff**.
- **Fallbacks** (p. ej., long‑polling) cuando WS no está disponible.
- **Rooms y namespaces** nativos.
- **Eventos con nombre** y **ack callbacks**.
- Middleware en el **handshake** y por **evento**.
- **Serialización** cómoda (JSON/buffer) y compatibilidad cross‑browser.

---

## 5) Socket.IO – Casos de uso y limitaciones

### Casos de uso (Socket.IO)
- **Chats/general real‑time**: rooms, acks, reconexión automática.
- **Apps colaborativas y dashboards** con usuarios heterogéneos/redes móviles.
- **Aplicaciones con necesidad de resiliencia** (NAT, proxies, firewalls).
- **Entrega confiable** y semántica de eventos clara (menos “plomería” manual).

### Limitaciones (Socket.IO)
- **Protocolo propio**: no es compatible con clientes WebSocket “puro”.
- **Overhead extra**: levemente mayor que WS crudo.
- **Escalado**: requiere **adapter** (Redis) y **sticky sessions** igualmente.
- **Depende del ecosistema** de Socket.IO (cliente/servidor específicos).

Cuándo preferir **Socket.IO**: cuando necesitas **time‑to‑market**, **resiliencia**, **rooms**, **reconexión** y **ergonomía**.

---

## 6) Comparativa rápida

| Dimensión            | WebSocket puro                          | Socket.IO                                  |
|---------------------|------------------------------------------|--------------------------------------------|
| Estándar            | RFC 6455                                 | Librería basada en WS / HTTP               |
| Reconexión          | Manual                                   | Integrada                                   |
| Fallback transporte | No                                        | Sí (long‑polling, etc.)                     |
| Rooms/Namespaces    | Manual                                   | Integrado                                   |
| Overhead            | Mínimo                                   | Leve extra                                  |
| Compatibilidad      | Muy buena (si WS permitido)              | Excelente (maneja entornos “hostiles”)      |
| Cliente             | `WebSocket` nativo o libs de bajo nivel  | Cliente Socket.IO                           |
| Casos ideales       | HFT, juegos, IoT muy exigente            | Chats, collab, dashboards, redes móviles    |

---

## 7) Arquitectura, escalado, observabilidad y seguridad

**Escalado horizontal**  
- Requiere **sticky sessions** o **session affinity** en el LB.  
- Para broadcast cross‑node: **adapter pub/sub** (Redis, NATS, Kafka).  
- Evitar estado solo en memoria local.

**Observabilidad**  
- Métricas: conexiones activas, mensajes por segundo, latencia (ping/pong), reconexiones.  
- Logs por **connectionId** y **userId**.  
- Trazas de delivery.

**Seguridad**  
- **WSS** (TLS) siempre.  
- **JWT** en handshake + re‑autenticación en reconexiones.  
- Autorización por room y validación de payload.  
- **Rate‑limit**, backpressure y límites de tamaño.

---

## 8) Ejemplo NestJS — WebSocket puro (ws)

```ts
// app.gateway.ts
import { WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: WebSocket) {
    console.log('Client connected');
    client.send('Bienvenido al WebSocket puro');
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }
}
```

---

## 9) Ejemplo NestJS — Socket.IO

```ts
// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string) {
    console.log(`Message from ${client.id}: ${payload}`);
    this.server.emit('message', payload);
  }
}
```

---

## 10) Recomendaciones finales

- **WebSocket puro**: máximo control y rendimiento, ideal para casos críticos.  
- **Socket.IO**: facilidad de uso, rooms, reconexión y robustez para entornos hostiles.  
- En ambos casos: **TLS, JWT, validaciones, rate‑limits, observabilidad y escalado con pub/sub**.
