# 1) WebSockets vs Socket.IO (y por qué usarlo)
- **WebSocket**: protocolo full-duplex a bajo nivel (solo frames binarios/texto).
- **Socket.IO**: librería de más alto nivel sobre WS/long-polling con:
  - **Reconexión automática** y backoff
  - **Namespaces** y **rooms**
  - **Acks** (callbacks por emisión)
  - **Broadcast** selectivo
  - **Middleware** y **auth** de handshake
  - **Adaptadores** (Redis) para cluster

**TL;DR:** para tiempo real con grupos/salas, autenticación sencilla y resiliencia → **Socket.IO** simplifica mucho.

---

# 2) Vocabulario clave
- **Namespace**: partición lógica (por defecto `/`). Útil para separar dominios (`/admin`, `/chat`).
- **Room**: subconjunto dinámico de sockets **dentro de un namespace**. Sirve para **broadcast selectivo**.
- **Socket**: conexión del cliente (una pestaña ≈ un socket).
- **Server**: instancia `io` del lado backend.

---

# 3) Ciclo de vida de conexión (cliente ↔ servidor)

## 3.1 Cliente (Vue ejemplo)
```ts
// cliente: emisión con auth en handshake
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    transports: ['websocket'],          // preferir WS
    auth: { token: 'Bearer <JWT>' },    // comentario: auth de handshake
    reconnection: true,                 // reconexión automática
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
});
```

## 3.2 Servidor (NestJS Gateway) – leer auth del handshake
```ts
// servidor (Nest): leer token del handshake y validar en middleware
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayInit {
    server!: Server;

    afterInit(server: Server) {
        // comentario: middleware Socket.IO nativo para autenticar conexiones
        server.use((socket, next) => {
            const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
            // TODO: validar token/JWT; si falla:
            // return next(new Error('Unauthorized'));
            return next();
        });
    }
}
```

**Idea:** para autorización por evento, también puedes usar **guards** de Nest (WS) en handlers.

---

# 4) Rooms: join, leave, broadcast… (lo esencial)

## 4.1 Unirse y salir de un room
```ts
// servidor (Nest): alta/ baja de salas
@SubscribeMessage('room:join')
onJoin(@ConnectedSocket() socket: Socket, @MessageBody() { roomId }: { roomId: string }) {
    roomId = String(roomId).trim();                 // sanea input
    socket.join(roomId);                            // entra a la sala
    socket.emit('room:joined', { roomId });         // respuesta al cliente
    socket.to(roomId).emit('room:system', { msg: 'A new player joined' }); // broadcast sin el emisor
}

@SubscribeMessage('room:leave')
onLeave(@ConnectedSocket() socket: Socket, @MessageBody() { roomId }: { roomId: string }) {
    socket.leave(roomId);                           // sale de la sala
    socket.to(roomId).emit('room:system', { msg: 'A player left' });
}
```

## 4.2 Enviar un mensaje a todos en un room
```ts
// servidor → todos en la sala (incluyendo emisor)
this.server.to(roomId).emit('game:state', state);

// servidor → todos menos el emisor
socket.to(roomId).emit('chat:message', payload);
```

## 4.3 Cliente escuchando y emitiendo
```ts
// cliente (Vue): emitir y escuchar
socket.emit('room:join', { roomId: 'abc123' });

socket.on('room:joined', (p) => console.log('Joined', p.roomId));
socket.on('room:system', (p) => console.log('System:', p.msg));

socket.on('game:state', (state) => render(state));
```

---

# 5) Acknowledgements (acks): “¿recibiste mi evento?”
Los **acks** son callbacks opcionales que el emisor pasa; el servidor los ejecuta para confirmar éxito/fracaso.

## 5.1 Cliente con ack
```ts
socket.emit('game:move', { index: 4 }, (ack: { ok: boolean; error?: string }) => {
    if (!ack.ok) console.warn('Move rejected:', ack.error);
});
```

## 5.2 Servidor respondiendo ack
```ts
@SubscribeMessage('game:move')
onMove(@ConnectedSocket() s: Socket, @MessageBody() payload: { index: number }) {
    const ok = isValidMove(payload.index);
    if (!ok) return s.emit('room:error', { message: 'Invalid move' }); // opcional
    // ... aplicar movimiento ...
    // ack: último argumento del callback implícito en socket.emit
    return { ok: true };  // Nest mapea retorno como ack si el cliente lo espera
}
```

> En Socket.IO “puro”, el handler recibe `(data, callback) => { callback({...}) }`.

---

# 6) Timeouts y emisiones volátiles
- **Timeouts:** si esperas ack y no llega, aborta y muestra error.
```ts
socket.timeout(2000).emit('game:move', { index: 4 }, (err: any, ack?: any) => {
    if (err) { /* timeout */ }
    else { /* usar ack */ }
});
```

- **Volatile:** no garantizado; si la conexión está saturada, se descarta (útil para métricas en vivo).
```ts
socket.volatile.emit('presence:ping', { t: Date.now() });
```

---

# 7) Patrones de broadcast (resumen de oro)
- **A todos:** `this.server.emit('event', data)`
- **A todos en un room:** `this.server.to(roomId).emit('event', data)`
- **A todos menos el emisor:** `socket.broadcast.emit('event', data)` o `socket.to(roomId).emit(...)`
- **A varios rooms:** `this.server.to([roomA, roomB]).emit('event', data)`
- **A un socket específico:** `this.server.to(socketId).emit('event', data)`

---

# 8) Inspección de rooms y sockets (server-side)

### 8.1 Listar sockets en un room
```ts
const sockets = await this.server.in(roomId).fetchSockets();
// sockets: Array<RemoteSocket>, con .id, .handshake, .rooms...
```

### 8.2 ¿Cuántos clientes hay?
```ts
const count = await this.server.in(roomId).allSockets(); // Set<string>
console.log('clients in room', count.size);
```

### 8.3 Ver rooms del adaptador
```ts
const roomsMap = this.server.sockets.adapter.rooms; // Map<roomId, Set<socketId>>
// OJO: incluye también rooms “personales” por socketId
```

---

# 9) Middleware y Guards (autorización, rate limiting)

## 9.1 Middleware de autorización (Socket.IO nativo en Nest)
```ts
afterInit(server: Server) {
    server.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        try {
            // verify(token) ...
            next();
        } catch {
            next(new Error('Unauthorized'));
        }
    });
}
```

## 9.2 Guard por handler (Nest)
```ts
// ejemplo esquelético
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
class WsGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const client = ctx.switchToWs().getClient<Socket>();
        // verificar permisos del client.data.user, etc.
        return true;
    }
}

@UseGuards(WsGuard)
@SubscribeMessage('room:join')
onJoin(/* ... */) { /* ... */ }
```

## 9.3 Rate limit rudimentario
```ts
const last = new Map<string, number>();
server.use((socket, next) => {
    socket.onAny((event) => {
        const now = Date.now();
        const prev = last.get(event) ?? 0;
        if (now - prev < 100) { /* drop o marcar */ }
        last.set(event, now);
    });
    next();
});
```

> Para algo serio, usa un **bucket token** por socket/room y métricas en Redis.

---

# 10) Estado por room (patrón) y consistencia

## 10.1 Estructura típica
```ts
interface RoomState {
    id: string;
    players: Array<{ id: string; nickname: string; role: 'X'|'O' }>;
    status: 'waiting' | 'playing' | 'finished';
    board: (null|'X'|'O')[];
    turn: 'X'|'O';
    updatedAt: number;
}
const rooms = new Map<string, RoomState>();
```

## 10.2 Reglas de integridad (ejemplo tres en raya)
- **Máx. 2 jugadores**; asignar roles (`X` primero).
- **Turno alternado**; validar en el server (no confíes en el cliente).
- **Movimientos idempotentes**: si la celda ya está ocupada → rechaza.
- **Ganador/empate**: calcula en el server y emite `game:state`.

**Extracto (validación de turno y celda):**
```ts
if (player.mark !== room.turn) return socket.emit('room:error', { message: 'Not your turn' });
if (room.board[idx]) return socket.emit('room:error', { message: 'Cell taken' });
```

---

# 11) Reconexión y re-join
- Guarda `roomId` y/o un `sessionId` en localStorage.
- Al reconectar, si hay estado y cupo, `socket.emit('room:join', ...)` de nuevo.
- Si no, ofrece **spectate** o crea sala nueva.

**Cliente (idea):**
```ts
socket.on('connect', () => {
    const saved = localStorage.getItem('roomId');
    if (saved) socket.emit('room:join', { roomId: saved, nickname: 'Rejoiner' });
});
```

---

# 12) Namespaces vs Rooms (cuándo usar cuál)
- **Namespace**: separar dominios o necesidades de autenticación diferentes (ej. `/admin` requiere rol).
- **Room**: agrupar dinámicamente usuarios de una misma “instancia” de algo (partida, documento, canal).

**Ejemplo namespaces + rooms:**
```ts
// servidor
const adminNs = this.server.of('/admin');
adminNs.use(authAdminOnly);
adminNs.on('connection', (socket) => {
    socket.join('ops'); // room “ops” dentro de /admin
});
```

---

# 13) Escalado horizontal: Redis Adapter
Con múltiples instancias, los rooms deben ser **compartidos entre procesos**. Usa el adaptador Redis.

**Instalación:**
```bash
pnpm add @socket.io/redis-adapter ioredis
```

**Nest (adapter básico en Gateway):**
```ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

afterInit(server: Server) {
    const pub = createClient({ url: 'redis://localhost:6379' });
    const sub = pub.duplicate();
    Promise.all([pub.connect(), sub.connect()]).then(() => {
        server.adapter(createAdapter(pub, sub));
    });
}
```

> Ahora `io.to(room).emit(...)` funciona entre instancias. También `fetchSockets()`, `allSockets()` atraviesan clúster.

---

# 14) Seguridad y hardening
- **Autenticación** en handshake y autorización por evento (roles).
- **Validación de inputs** (roomId, payloads). Rechaza strings vacíos, índices fuera de rango, etc.
- **Rate limiting** y **anti-spam** (throttle por evento).
- **No confíes en el cliente**: valida turnos, ganador, límites.
- **Evita filtraciones**: nunca envíes datos sensibles de otros usuarios.

---

# 15) Errores comunes (y cómo evitarlos)
1. **Confiar en el cliente** para reglas del juego → valida en server.
2. **Rooms “zombies”**: no limpiar estado al desconectar → en `disconnect`, quita al jugador y cierra sala si está vacía.
3. **Fuga de listeners**: no hacer `socket.off(...)` al destruir componente → limpiar en `onBeforeUnmount`.
4. **Colisiones de nombre de evento**: estandariza prefijos (`room:*`, `game:*`, `chat:*`).

---

# 16) Mini-recetario (cheat-sheet)

### Unirse a sala
```ts
socket.join(roomId);
socket.emit('room:joined', { roomId });
```

### Salir de sala
```ts
socket.leave(roomId);
socket.to(roomId).emit('room:system', { msg: 'left' });
```

### Broadcast a sala
```ts
io.to(roomId).emit('event', data);          // todos (incluye emisor si lo llama io)
socket.to(roomId).emit('event', data);      // todos menos emisor
```

### Acks
```ts
// cliente
socket.emit('op', data, (ack) => { /* ok/fail */ });

// servidor (Nest)
@SubscribeMessage('op')
onOp(@MessageBody() d) { return { ok: true }; }
```

### Listar sockets en una sala
```ts
const sockets = await io.in(roomId).fetchSockets();
```

### Contar clientes en una sala
```ts
const set = await io.in(roomId).allSockets();
const count = set.size;
```

### Enviar a un socket específico
```ts
io.to(socketId).emit('event', data);
```

### Emisión con timeout
```ts
socket.timeout(2000).emit('ping', (err, res) => { if (err) /* timeout */ });
```

---

# 17) Extractos aplicados a juegos (NestJS + Vue)

## 17.1 NestJS: “join con validación y notificación”
```ts
@SubscribeMessage('room:join')
onJoin(@ConnectedSocket() s: Socket, @MessageBody() { roomId, nickname }: any) {
    roomId = (roomId ?? '').trim();
    if (!roomId) return s.emit('room:error', { message: 'Invalid room' });

    const room = this.rooms.get(roomId) ?? this.initRoom(roomId);
    if (room.players.length >= 2) return s.emit('room:error', { message: 'Room is full' });

    s.join(roomId);
    this.socketRoom.set(s.id, roomId);

    room.players.push({ socketId: s.id, nickname: nickname?.slice(0, 20) || 'Player', mark: null });
    this.assignMarks(room);

    s.emit('room:joined', { roomId, mark: room.players.find(p => p.socketId === s.id)?.mark });
    this.server.to(roomId).emit('room:players', { players: room.players.map(p => ({ nickname: p.nickname, mark: p.mark })) });
    this.server.to(roomId).emit('game:state', this.publicState(room));
}
```

## 17.2 Vue: emitir movimiento con ack y mostrar error
```ts
socket.emit('game:move', { index }, (ack: { ok: boolean; error?: string }) => {
    if (!ack?.ok) errorMsg.value = ack?.error ?? 'Unknown error';
});
```

