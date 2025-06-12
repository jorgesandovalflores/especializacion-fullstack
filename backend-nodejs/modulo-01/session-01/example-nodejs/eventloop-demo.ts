// src/eventloop-demo.ts
function blockingSleep(ms: number): void {
	console.log(`2 Iniciando bloqueo de ${ms}ms...`);
	const end = Date.now() + ms;
	while (Date.now() < end) {} // bloquea el hilo principal
	console.log(`3 Fin del bloqueo de ${ms}ms`);
}

function asyncTask(name: string, delay: number): void {
	setTimeout(() => {
		console.log(`1 Tarea asíncrona completada: ${name}`);
	}, delay);
}

console.log("🏁 Inicio del script");

// Lanza tareas asincrónicas
asyncTask("leer archivo", 1000);
asyncTask("consultar base de datos", 1500);

// Ejecuta una tarea que bloquea el event loop
blockingSleep(2000); // esto bloquea todo el procesamiento de las tareas anteriores

console.log("🏁 Fin del script");