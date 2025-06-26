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
