
# SESIÓN 3 – EVENT LOOP Y PROGRAMACIÓN ASÍNCRONA EN NODE.JS

## 🎯 Objetivo de la clase

Comprender a profundidad cómo funciona el Event Loop en Node.js, cómo se manejan las tareas asíncronas con callbacks, promesas y async/await, y cómo aplicar Streams y EventEmitter para desarrollar aplicaciones eficientes y escalables con Node.js.

## 📚 Contenido

1. Funcionamiento del Event Loop en Node.js  
2. Callbacks, Promises y Async/Await  
3. Manejo eficiente de tareas asíncronas  
4. Uso de Streams para procesamiento de datos  
5. EventEmitter y programación orientada a eventos  
6. Comparaciones con otros lenguajes (Python y Java)  
7. Ejercicios prácticos aplicados  

## 1️⃣ FUNCIONAMIENTO DEL EVENT LOOP EN NODE.JS

### 🧠 ¿Qué es el Event Loop?

Node.js opera en un único hilo principal utilizando un sistema basado en **eventos** y **callbacks**. Gracias al Event Loop, puede realizar operaciones I/O (entrada/salida) de forma **asíncrona y no bloqueante**, lo que lo hace extremadamente eficiente para sistemas con alta concurrencia, como APIs o servidores web.

### 🧩 Componentes del Event Loop

#### 1. Call Stack (pila de llamadas)
- Es **sincrónica y LIFO** (Last In, First Out).
- Aquí se apilan y ejecutan las funciones que llamas directamente en tu código.
- Cuando una función termina, se desapila.
- Si una función llama a otra, esta segunda se apila encima.
- Si una función contiene una llamada asíncrona (por ejemplo, `setTimeout()`), esta no se ejecuta aquí, sino que se delega a otros componentes.

```js
function uno() {
	console.log('Uno');
}
function dos() {
	uno();
	console.log('Dos');
}
dos();
```

#### 2. Node/Web APIs (Heap & Memory)
- El **heap** es donde vive la memoria asignada dinámicamente.
- Aquí se almacenan objetos, funciones y variables mientras están vivas.
- Se accede a esta memoria de forma indirecta (por referencias).
- El recolector de basura (GC) limpia lo que ya no se usa.

```js
console.log('Inicio');
setTimeout(() => {
	console.log('Timeout');
}, 0);
console.log('Fin');
```

#### 3. Callback Queue
- Es una **cola FIFO** (First In, First Out).
- Las funciones asíncronas (`setTimeout`, `setInterval`, `on('data')`, etc.) se encolan aquí cuando están listas para ejecutarse.
- El **Event Loop** mueve funciones a la pila de llamadas **solo si está vacía**.

```js
setTimeout(() => {
	console.log('Desde setTimeout');
}, 0);
console.log('Después del timeout');
```

#### 4. Microtask Queue
- Es una **cola de tareas** **prioritaria** frente a la Callback Queue.
- Contiene tareas que deben ejecutarse **inmediatamente después** de que el Call Stack quede vacío, **antes de pasar a la siguiente fase del Event Loop**.
- Es usada principalmente por:
  - `Promise.then()`
  - `Promise.catch()`
  - `Promise.finally()`
  - `queueMicrotask()`
  - `MutationObserver` (en el navegador)

```js
Promise.resolve().then(() => console.log('Microtarea'));
setTimeout(() => console.log('Timeout'), 0);
console.log('Fin');
```

#### 5. libuv y Thread Pool
- Node.js es de un solo hilo, pero usa **libuv**, una librería en C que permite manejar múltiples hilos para tareas pesadas.
- Ejemplos:
  - Operaciones de sistema de archivos (`fs.readFile`)
  - DNS lookup
  - Compresión/descompresión
  - Criptografía
- Estas tareas **no bloquean el Event Loop**, se delegan aquí.

```js
const fs = require('fs');
fs.readFile('archivo.txt', 'utf-8', (err, data) => {
	console.log('Archivo leído');
});
console.log('Lectura en proceso...');
```

#### 6. Event Loop
- Es el **corazón del motor de ejecución**.
- Orquesta la ejecución de tareas asincrónicas y sincrónicas.
- Sigue un **ciclo de fases**, entre ellas:
  - **Timers** (ejecuta `setTimeout`, `setInterval`)
  - **I/O callbacks**
  - **Idle/Prepare**
  - **Poll** (espera nuevas tareas)
  - **Check** (`setImmediate`)
  - **Close callbacks`)
- Revisa la **microtask queue** (como `Promise.then()`, `queueMicrotask`) **antes de pasar a la siguiente fase**.

```js
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promesa'));
process.nextTick(() => console.log('nextTick'));
console.log('Fin');
```
## 🔁 Flujo simplificado

```text
1️⃣ Ejecuta funciones del Call Stack (síncronas)
2️⃣ Atiende microtareas (Promise.then, etc.)
3️⃣ Si el stack está libre, toma tareas del Callback Queue
4️⃣ Si hay I/O en libuv, espera resultados
5️⃣ Repite el ciclo (tick)
```

### 🔁 Fases del Event Loop

- Timers
- Pending Callbacks
- Idle, Prepare
- Poll
- Check
- Close Callbacks

### 🎯 Diagrama visual

```
 ┌────────────────────────────┐
 │          Call Stack        │
 └────────────┬───────────────┘
              ↓
        ┌─────────────┐
        │   Web APIs  │
        └────┬────────┘
             ↓
   ┌─────────────┐  ┌──────────────┐
   │ Callback Q  │  │ Microtask Q  │
   └────┬────────┘  └──────┬───────┘
        ↓                 ↓
         └─────── Event Loop ───────▶
```

## 2️⃣ CALLBACKS, PROMISES Y ASYNC/AWAIT

### Callbacks

```js
const fs = require('fs');
fs.readFile('archivo.txt', 'utf-8', (err, data) => {
	if (err) return console.error('Error:', err);
	console.log('Contenido:', data);
});
```

### Promises

```js
function leerArchivo(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf-8', (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}
```

### Async / Await

```js
async function ejecutar() {
	try {
		const contenido = await leerArchivo('archivo.txt');
		console.log('Contenido:', contenido);
	} catch (err) {
		console.error('Error:', err);
	}
}
```

## 3️⃣ MANEJO EFICIENTE DE TAREAS ASÍNCRONAS

```js
const archivos = ['a.txt', 'b.txt', 'c.txt'];
await Promise.all(archivos.map(leerArchivo));
```

```js
process.on('unhandledRejection', (err) => {
	console.error('Promesa no manejada:', err);
});
```

## 4️⃣ STREAMS

```js
const fs = require('fs');
const stream = fs.createReadStream('archivo.txt', { encoding: 'utf-8' });

stream.on('data', (chunk) => {
	console.log('Chunk recibido:', chunk);
});
stream.on('end', () => {
	console.log('Lectura finalizada');
});
```

## 5️⃣ EVENTEMITTER

```js
const { EventEmitter } = require('events');
const emisor = new EventEmitter();

emisor.on('saludo', (nombre) => {
	console.log(`Hola, ${nombre}`);
});

emisor.emit('saludo', 'Carlos');
```

## 6️⃣ COMPARACIÓN CON OTROS LENGUAJES

| Concepto         | Node.js              | Python (`asyncio`)  | Java (`CompletableFuture`) |
|------------------|----------------------|----------------------|-----------------------------|
| Event Loop       | Sí (`libuv`)         | Sí (`asyncio`)       | No nativo (usa threads)     |
| Async/Await      | Sí (ES2017)          | Sí (3.5+)            | Experimental (Project Loom) |
| EventEmitter     | `events`             | `asyncio.Event`      | Interfaces `Observer`       |
| Streams          | `stream`             | `aiofiles`, `yield`  | `InputStream`, `Buffered`   |
