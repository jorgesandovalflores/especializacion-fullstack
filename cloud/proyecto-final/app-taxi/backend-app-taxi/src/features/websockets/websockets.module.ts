import { Module } from "@nestjs/common";
import { EventsGateway } from "./events/events.gateway";
import { WebsocketsService } from "./websockets.service";
import { SimulationService } from "./simulation/simulation.service";
import { SimulationController } from "./simulation/simulation.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassengerModule } from "../passengers/passenger.module";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const accessTtlSec = configService.get<number>(
                    "JWT_ACCESS_TTL_SEC",
                    3600,
                );
                const secret = configService.get<string>("JWT_ACCESS_SECRET");

                if (!secret) {
                    throw new Error(
                        "JWT_ACCESS_SECRET is not defined in environment variables",
                    );
                }

                return {
                    secret,
                    signOptions: {
                        expiresIn: `${accessTtlSec}s`,
                    },
                };
            },
            inject: [ConfigService],
        }),
        PassengerModule,
    ],
    controllers: [SimulationController],
    providers: [EventsGateway, WebsocketsService, SimulationService],
    exports: [EventsGateway, WebsocketsService, SimulationService],
})
export class WebsocketsModule {}
