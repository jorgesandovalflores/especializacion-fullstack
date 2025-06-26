# Comparación de Sincronía y Asincronía en Node.js con Event Loop

Este documento utiliza un servicio en NestJS (`UserService`) para explicar conceptos fundamentales del Event Loop en Node.js.

## Código base

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    public countSync: number = 0
    public countAsync: number = 0

	// Operación SINCRÓNICA pesada (bloquea el Event Loop)
	blockingSync(): string {
        this.countSync++
        let index = Number(this.countSync)
		console.log(`${index} [SYNC] Inicio de tarea bloqueante`);
		const start = Date.now();
		while (Date.now() - start < 5000) {
			// bucle de 5 segundos (bloquea completamente)
		}
		console.log(`${index} [SYNC] Tarea terminada`);
		return 'Tarea sincrónica terminada';
	}

	// Operación ASÍNCRONA (libera el Event Loop)
	async nonBlockingAsync(): Promise<string> {
        this.countAsync++
        let index = Number(this.countAsync)
		console.log(`${index} [ASYNC] Inicio de tarea no bloqueante`);
		await new Promise(resolve => setTimeout(resolve, 5000)); // espera sin bloquear
		console.log(`${index} [ASYNC] Tarea terminada`);
		return 'Tarea asíncrona terminada';
	}
}
```

---

## Conceptos del Event Loop que se pueden explicar

### 1. Call Stack (Pila de llamadas)

* **Qué es:** Donde se apilan las funciones que se están ejecutando.
* **Ejemplo:** `blockingSync()` ocupa la pila por 5s completos. Nada más puede ejecutarse durante ese tiempo.

### 2. Blocking vs Non-blocking I/O

* **Qué es:** Operaciones que bloquean o no el hilo principal.
* **Ejemplo:**

  * `blockingSync()` bloquea.
  * `nonBlockingAsync()` libera el hilo para otras tareas.

### 3. Task Queue (Macrotasks)

* **Qué es:** Cola donde entran tareas como `setTimeout`, `fs.readFile`, etc.
* **Ejemplo:** En `nonBlockingAsync()` el `setTimeout` va a la Task Queue.

### 4. Event Loop

* **Qué es:** Mecanismo que coordina Call Stack y las colas de tareas.
* **Ejemplo:**

  * Si `blockingSync()` se está ejecutando, el Event Loop **no puede avanzar**.
  * Si se ejecuta `nonBlockingAsync()`, el Event Loop sigue activo.

---

## Pruebas sugeridas

### Prueba 1: bloqueo real

```bash
curl http://localhost:3000/users/sync-block &
curl http://localhost:3000/users/ping
```

**Resultado:** `ping` se bloquea 5s.

### Prueba 2: asincronía no bloqueante

```bash
curl http://localhost:3000/users/async-block &
curl http://localhost:3000/users/ping
```

**Resultado:** `ping` responde inmediatamente.

---

## Comparación

| Concepto             | `blockingSync()` | `nonBlockingAsync()`  |
| -------------------- | ---------------- | --------------------- |
| Call Stack           | Ocupado por 5s   | Libera inmediatamente |
| Event Loop           | Bloqueado        | Activo                |
| Task Queue           | No aplica        | Sí, por `setTimeout`  |
| Bloquea otras tareas | Sí               | No                    |
| Escalabilidad        | Mala             | Buena                 |

---

## Conclusión

Este ejemplo muestra de forma clara cómo las operaciones sincrónicas afectan negativamente el rendimiento de una aplicación Node.js al bloquear el Event Loop, mientras que las asincrónicas permiten un sistema más reactivo y escalable.
