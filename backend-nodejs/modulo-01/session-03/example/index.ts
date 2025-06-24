// ✅ Leer 3 archivos usando Promise.all y mostrar su contenido
import { readFile, createReadStream } from 'fs';
import { promisify } from 'util';
import { EventEmitter } from 'events';

const readFileAsync = promisify(readFile);

async function leerArchivos(paths: string[]) {
	try {
		const contenidos = await Promise.all(paths.map(path => readFileAsync(path, 'utf-8')));
		contenidos.forEach((contenido, index) => {
			console.log(`Archivo ${index + 1}:\n${contenido}`);
		});
	} catch (err) {
		console.error('Error leyendo archivos:', err);
	}
}

// Crear un sistema de notificaciones con EventEmitter
class Notificador extends EventEmitter {
	enviar(mensaje: string) {
		this.emit('notificacion', mensaje);
	}
}

const notificador = new Notificador();
notificador.on('notificacion', (msg) => {
	console.log('Notificación recibida:', msg);
});
notificador.enviar('Has recibido un nuevo mensaje.');

// Procesar un archivo grande con createReadStream y contar una palabra
function contarCoincidencias(path: string, palabra: string): Promise<void> {
	return new Promise((resolve, reject) => {
		let contador = 0;
		let buffer = '';

		// Buscar cualquier aparición parcial, insensible a mayúsculas
		const palabraMin = palabra.toLowerCase();
		const stream = createReadStream(path, { encoding: 'utf-8' });

		stream.on('data', (chunk: any) => {
			buffer += chunk.toLowerCase();

			let index = buffer.indexOf(palabraMin);
			while (index !== -1) {
				contador++;
				index = buffer.indexOf(palabraMin, index + 1);
			}

			// Deja los últimos caracteres en el buffer para evitar cortar la palabra
			buffer = buffer.slice(-palabra.length);
		});

		stream.on('end', () => {
			console.log(`La palabra "${palabra}" aparece ${contador} veces (LIKE match).`);
			resolve();
		});

		stream.on('error', (err) => reject(err));
	});
}

// Comparar el orden de ejecución
function compararOrdenEjecucion() {
	setTimeout(() => console.log('setTimeout'), 0);
	setImmediate(() => console.log('setImmediate'));
	Promise.resolve().then(() => console.log('Promise'));
	process.nextTick(() => console.log('nextTick'));
}

// 🧪 Ejecutar funciones
(async () => {
	await leerArchivos(['archivo1.sql', 'archivo2.sql', 'archivo3.sql']);
	await contarCoincidencias('archivo1.sql', 'PANIC');
	compararOrdenEjecucion();
})();
