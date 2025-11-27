import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { decode } from "@googlemaps/polyline-codec";
import { WebsocketsService } from "../websockets.service";

export interface RouteSimulation {
    geometry: string;
    duration: number;
    distance: number;
    isRunning: boolean;
    currentStep: number;
    totalSteps: number;
    coordinates: [number, number][];
    intervalId?: NodeJS.Timeout;
}

export interface PositionUpdate {
    latitude: number;
    longitude: number;
    bearing: number;
    progress: number;
    currentStep: number;
    totalSteps: number;
}

@Injectable()
export class SimulationService implements OnModuleInit {
    private readonly logger = new Logger(SimulationService.name);
    private simulations: Map<string, RouteSimulation> = new Map();

    constructor(private readonly websocketsService: WebsocketsService) {}

    onModuleInit() {
        this.logger.log("Simulation service initialized");
    }

    /**
     * Calcula el bearing (dirección) entre dos coordenadas
     */
    private calculateBearing(
        startLat: number,
        startLng: number,
        endLat: number,
        endLng: number,
    ): number {
        const startLatRad = (startLat * Math.PI) / 180;
        const startLngRad = (startLng * Math.PI) / 180;
        const endLatRad = (endLat * Math.PI) / 180;
        const endLngRad = (endLng * Math.PI) / 180;

        const y = Math.sin(endLngRad - startLngRad) * Math.cos(endLatRad);
        const x =
            Math.cos(startLatRad) * Math.sin(endLatRad) -
            Math.sin(startLatRad) *
                Math.cos(endLatRad) *
                Math.cos(endLngRad - startLngRad);

        let bearing = Math.atan2(y, x);
        bearing = (bearing * 180) / Math.PI;
        bearing = (bearing + 360) % 360;

        return Math.round(bearing * 100) / 100; // Redondear a 2 decimales
    }

    /**
     * Inicia la simulación de una ruta OSRM
     */
    startRouteSimulation(
        simulationId: string,
        geometry: string,
        duration: number,
        distance: number,
    ): void {
        try {
            // Decodificar el polyline
            const coordinates = decode(geometry);

            if (coordinates.length === 0) {
                this.logger.error(
                    `No coordinates found for simulation ${simulationId}`,
                );
                return;
            }

            // Detener simulación existente si hay una
            this.stopRouteSimulation(simulationId);

            const simulation: RouteSimulation = {
                geometry,
                duration,
                distance,
                isRunning: true,
                currentStep: 0,
                totalSteps: coordinates.length,
                coordinates,
            };

            this.simulations.set(simulationId, simulation);

            // Calcular intervalo entre puntos (en ms)
            const intervalMs = (duration * 1000) / coordinates.length;

            this.logger.log(
                `Starting simulation ${simulationId} with ${coordinates.length} points, interval: ${intervalMs}ms`,
            );

            // Iniciar la simulación
            simulation.intervalId = setInterval(() => {
                this.emitNextPosition(simulationId);
            }, intervalMs);
        } catch (error) {
            this.logger.error(
                `Error starting simulation ${simulationId}:`,
                error,
            );
        }
    }

    /**
     * Emite la siguiente posición de la simulación
     */
    private emitNextPosition(simulationId: string): void {
        const simulation = this.simulations.get(simulationId);
        if (!simulation || !simulation.isRunning) return;

        const { coordinates, currentStep, totalSteps } = simulation;

        if (currentStep >= totalSteps) {
            // Simulación completada, reiniciar
            this.logger.log(
                `Simulation ${simulationId} completed, restarting...`,
            );
            simulation.currentStep = 0;
        }

        const [latitude, longitude] = coordinates[simulation.currentStep];

        // Calcular bearing basado en la dirección hacia el siguiente punto
        let bearing = 0;
        if (simulation.currentStep < totalSteps - 1) {
            const [nextLat, nextLng] = coordinates[simulation.currentStep + 1];
            bearing = this.calculateBearing(
                latitude,
                longitude,
                nextLat,
                nextLng,
            );
        } else if (totalSteps > 1) {
            // Si es el último punto, usar la dirección del punto anterior
            const [prevLat, prevLng] = coordinates[simulation.currentStep - 1];
            bearing = this.calculateBearing(
                prevLat,
                prevLng,
                latitude,
                longitude,
            );
        }

        const positionUpdate: PositionUpdate = {
            latitude,
            longitude,
            bearing,
            progress: (simulation.currentStep / totalSteps) * 100,
            currentStep: simulation.currentStep,
            totalSteps,
        };

        // Emitir por Socket.IO al room "passengers-main"
        this.websocketsService.emitToRoom(
            "passengers-main",
            "route",
            positionUpdate,
        );

        this.logger.debug(
            `Simulation ${simulationId}: Step ${simulation.currentStep + 1}/${totalSteps} - Lat: ${latitude}, Lng: ${longitude}, Bearing: ${bearing}°`,
        );

        // Avanzar al siguiente paso
        simulation.currentStep++;

        // Si llegamos al final, reiniciamos
        if (simulation.currentStep >= totalSteps) {
            simulation.currentStep = 0;
        }
    }

    /**
     * Detiene una simulación específica
     */
    stopRouteSimulation(simulationId: string): void {
        const simulation = this.simulations.get(simulationId);
        if (simulation && simulation.intervalId) {
            clearInterval(simulation.intervalId);
            simulation.isRunning = false;
            this.simulations.delete(simulationId);
            this.logger.log(`Simulation ${simulationId} stopped`);
        }
    }

    /**
     * Obtiene el estado de una simulación
     */
    getSimulationStatus(simulationId: string): {
        isRunning: boolean;
        progress?: number;
    } {
        const simulation = this.simulations.get(simulationId);
        if (!simulation) {
            return { isRunning: false };
        }

        return {
            isRunning: simulation.isRunning,
            progress: (simulation.currentStep / simulation.totalSteps) * 100,
        };
    }

    /**
     * Obtiene todas las simulaciones activas
     */
    getActiveSimulations(): string[] {
        return Array.from(this.simulations.keys());
    }

    /**
     * Detiene todas las simulaciones
     */
    stopAllSimulations(): void {
        for (const simulationId of this.simulations.keys()) {
            this.stopRouteSimulation(simulationId);
        }
        this.logger.log("All simulations stopped");
    }
}
