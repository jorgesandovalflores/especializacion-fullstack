import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MonitoringService {
    private readonly logger = new Logger(MonitoringService.name);
    private memoryLeakArray: any[] = [];
    private requestCount = 0;

    async generateCpuSpike(durationMs: number): Promise<void> {
        this.logger.log(`Generating CPU spike for ${durationMs}ms`);
        const startTime = Date.now();

        // Intensive CPU computation
        while (Date.now() - startTime < durationMs) {
            // Fibonacci-like computation to spike CPU
            this.calculateFibonacci(40);
        }

        this.logger.log("CPU spike completed");
    }

    private calculateFibonacci(n: number): number {
        if (n <= 1) return n;
        return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
    }

    generateMemoryLeak(iterations: number): void {
        this.logger.log(`Generating memory leak with ${iterations} iterations`);

        for (let i = 0; i < iterations; i++) {
            // Intentionally creating memory leak
            this.memoryLeakArray.push(
                new Array(1000000).fill("memory_leak_data"),
            );
            this.logger.warn(`Memory leak iteration ${i + 1}`);
        }
    }

    async generateHighLatency(delayMs: number): Promise<void> {
        this.logger.log(`Generating high latency of ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        this.logger.log("High latency completed");
    }

    generateRandomError(): void {
        this.requestCount++;
        this.logger.log(
            `Request #${this.requestCount} - Checking for error...`,
        );

        // Generate error every 3rd request
        if (this.requestCount % 3 === 0) {
            this.logger.error("Random error generated for monitoring purposes");
            throw new Error("Simulated random error for CloudWatch monitoring");
        }
    }

    getCurrentMetrics(): any {
        const memoryUsage = process.memoryUsage();

        return {
            timestamp: new Date().toISOString(),
            memory: {
                heapUsed:
                    Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
                heapTotal:
                    Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
            },
            uptime: process.uptime(),
            requestCount: this.requestCount,
            memoryLeakSize: this.memoryLeakArray.length,
        };
    }
}
