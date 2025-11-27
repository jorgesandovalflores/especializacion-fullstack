import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const client: Socket = context.switchToWs().getClient();

        if (!client.data.passengerId) {
            throw new WsException("Unauthorized");
        }

        return true;
    }
}
