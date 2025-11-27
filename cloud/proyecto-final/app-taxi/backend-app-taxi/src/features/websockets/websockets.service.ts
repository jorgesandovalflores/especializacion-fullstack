import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class WebsocketsService {
    private server: Server;

    setServer(server: Server) {
        this.server = server;
    }

    getServer(): Server {
        return this.server;
    }

    emitToPassenger(passengerId: string, event: string, data: any) {
        if (this.server) {
            this.server.to(`passenger_${passengerId}`).emit(event, data);
        }
    }

    emitToAllPassengers(event: string, data: any) {
        if (this.server) {
            this.server.emit(event, data);
        }
    }

    emitToRoom(room: string, event: string, data: any) {
        if (this.server) {
            this.server.to(room).emit(event, data);
        }
    }
}
