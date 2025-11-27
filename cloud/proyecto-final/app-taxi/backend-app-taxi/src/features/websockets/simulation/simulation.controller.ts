import { Controller, Post, Delete, Get, Body, Param } from "@nestjs/common";
import { SimulationService } from "./simulation.service";

interface StartSimulationDto {
    geometry: string;
    duration: number;
    distance: number;
    bearer: string;
}

@Controller("simulation")
export class SimulationController {
    constructor(private readonly simulationService: SimulationService) {}

    @Post("start/:id")
    startSimulation(
        @Param("id") simulationId: string,
        @Body() body: StartSimulationDto,
    ) {
        const { geometry, duration, distance, bearer } = body;

        this.simulationService.startRouteSimulation(
            simulationId,
            geometry,
            duration,
            distance,
        );

        return {
            success: true,
            message: `Simulation ${simulationId} started`,
            simulationId,
        };
    }

    @Delete("stop/:id")
    stopSimulation(@Param("id") simulationId: string) {
        this.simulationService.stopRouteSimulation(simulationId);

        return {
            success: true,
            message: `Simulation ${simulationId} stopped`,
        };
    }

    @Get("status/:id")
    getSimulationStatus(@Param("id") simulationId: string) {
        const status = this.simulationService.getSimulationStatus(simulationId);

        return {
            simulationId,
            ...status,
        };
    }

    @Get("active")
    getActiveSimulations() {
        const activeSimulations = this.simulationService.getActiveSimulations();

        return {
            activeSimulations,
            count: activeSimulations.length,
        };
    }

    @Delete("stop-all")
    stopAllSimulations() {
        this.simulationService.stopAllSimulations();

        return {
            success: true,
            message: "All simulations stopped",
        };
    }
}
