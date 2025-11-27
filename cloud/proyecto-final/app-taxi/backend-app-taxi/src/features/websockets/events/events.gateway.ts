import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { WebsocketsService } from "../websockets.service";
import { PassengerDao } from "src/features/passengers/dao/passenger.dao";
import { WsJwtGuard } from "./guards/ws-jwt.guard";

@WebSocketGateway({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    namespace: "events",
})
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(EventsGateway.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly websocketsService: WebsocketsService,
        private readonly passengerDao: PassengerDao,
    ) {}

    afterInit(server: Server) {
        this.logger.log("WebSocket Gateway initialized");
        this.websocketsService.setServer(server);
    }

    async handleConnection(client: Socket) {
        try {
            this.logger.log(`New connection attempt from client: ${client.id}`);
            this.logger.debug(`Handshake headers:`, client.handshake.headers);
            this.logger.debug(`Handshake auth:`, client.handshake.auth);
            this.logger.debug(`Handshake query:`, client.handshake.query);

            // Autenticación via token JWT
            const token = this.extractTokenFromSocket(client);
            if (!token) {
                this.logger.warn(`No token provided for client: ${client.id}`);
                client.disconnect();
                return;
            }

            this.logger.debug(
                `Token found for client: ${client.id}, verifying...`,
            );

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
            });

            this.logger.debug(
                `Token verified for client: ${client.id}, payload:`,
                payload,
            );

            if (payload.typ !== "passenger") {
                this.logger.warn(
                    `Invalid user type for client: ${client.id}, type: ${payload.typ}`,
                );
                client.disconnect();
                return;
            }

            // Verificar que el pasajero existe
            const passenger = await this.passengerDao.findById(payload.sub);
            if (!passenger) {
                this.logger.warn(
                    `Passenger not found for client: ${client.id}, passengerId: ${payload.sub}`,
                );
                client.disconnect();
                return;
            }

            this.logger.debug(
                `Passenger found: ${passenger.id} for client: ${client.id}`,
            );

            // Unir al cliente a una sala específica del pasajero
            client.join(`passenger_${passenger.id}`);
            client.data.passengerId = passenger.id;
            client.data.userType = "passenger";

            this.logger.log(
                `Client connected successfully: ${client.id}, Passenger: ${passenger.id}`,
            );

            // Notificar al cliente que se conectó exitosamente
            client.emit("connection_success", {
                message: "Connected successfully",
                passengerId: passenger.id,
            });

            this.logger.debug(
                `Connection success event sent to client: ${client.id}`,
            );
        } catch (error) {
            this.logger.error(
                `Authentication failed for client: ${client.id}`,
                error,
            );
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    private extractTokenFromSocket(client: Socket): string | null {
        // 1. Intentar desde headers (forma recomendada)
        const authHeader = client.handshake.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // 2. Intentar desde query parameters (forma alternativa)
        const tokenFromQuery = client.handshake.auth?.token;
        if (tokenFromQuery) {
            return tokenFromQuery;
        }

        // 3. Intentar desde auth object (otra alternativa)
        const authToken = client.handshake.query?.token as string;
        if (authToken) {
            return authToken;
        }

        return null;
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage("join_room")
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { room: string },
    ) {
        client.join(data.room);
        client.emit("room_joined", { room: data.room });
        this.logger.log(`Client ${client.id} joined room: ${data.room}`);
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage("leave_room")
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { room: string },
    ) {
        client.leave(data.room);
        client.emit("room_left", { room: data.room });
        this.logger.log(`Client ${client.id} left room: ${data.room}`);
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage("send_message")
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { room: string; message: string },
    ) {
        this.server.to(data.room).emit("new_message", {
            from: client.data.passengerId,
            message: data.message,
            timestamp: new Date().toISOString(),
        });
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage("join_passengers_main")
    handleJoinPassengersMain(@ConnectedSocket() client: Socket) {
        client.join("passengers-main");
        client.emit("joined_passengers_main", {
            success: true,
            message: "Joined passengers-main room",
        });
        this.logger.log(`Client ${client.id} joined passengers-main room`);
    }

    // Método para emitir eventos a un pasajero específico
    emitToPassenger(passengerId: string, event: string, data: any) {
        this.server.to(`passenger_${passengerId}`).emit(event, data);
    }

    // Método para emitir eventos a todos los pasajeros
    emitToAllPassengers(event: string, data: any) {
        this.server.emit(event, data);
    }

    // Método para emitir eventos a múltiples pasajeros
    emitToMultiplePassengers(passengerIds: string[], event: string, data: any) {
        passengerIds.forEach((passengerId) => {
            this.server.to(`passenger_${passengerId}`).emit(event, data);
        });
    }
}
