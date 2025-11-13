import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MonitoringController } from "./monitoring/monitoring.controller";
import { MonitoringService } from "./monitoring/monitoring.service";

@Module({
    imports: [],
    controllers: [AppController, MonitoringController],
    providers: [AppService, MonitoringService],
})
export class AppModule {}
