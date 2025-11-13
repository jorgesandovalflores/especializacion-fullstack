import { Controller, Get, Query, Res, HttpStatus } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { Response } from "express";

@Controller("monitoring")
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) {}

    @Get("cpu-spike")
    async generateCpuSpike(
        @Query("duration") duration: string = "5000",
    ): Promise<any> {
        const durationMs = parseInt(duration);
        await this.monitoringService.generateCpuSpike(durationMs);
        return {
            message: `CPU spike generated for ${durationMs}ms`,
            timestamp: new Date().toISOString(),
        };
    }

    @Get("memory-leak")
    async generateMemoryLeak(
        @Query("iterations") iterations: string = "10",
    ): Promise<any> {
        const iterationsCount = parseInt(iterations);
        this.monitoringService.generateMemoryLeak(iterationsCount);
        return {
            message: `Memory leak simulation started with ${iterationsCount} iterations`,
            timestamp: new Date().toISOString(),
        };
    }

    @Get("high-latency")
    async generateHighLatency(
        @Query("delay") delay: string = "3000",
    ): Promise<any> {
        const delayMs = parseInt(delay);
        await this.monitoringService.generateHighLatency(delayMs);
        return {
            message: `High latency response after ${delayMs}ms`,
            timestamp: new Date().toISOString(),
        };
    }

    @Get("error")
    async generateError(@Res() res: Response): Promise<void> {
        try {
            this.monitoringService.generateRandomError();
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Internal Server Error",
                message: "Random error generated for testing",
                timestamp: new Date().toISOString(),
            });
        }
    }

    @Get("metrics")
    getMetrics(): any {
        return this.monitoringService.getCurrentMetrics();
    }
}
