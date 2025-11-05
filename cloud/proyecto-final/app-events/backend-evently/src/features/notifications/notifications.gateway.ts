import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({ path: '/notifications/ws', cors: { origin: true, credentials: true } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        @Inject(forwardRef(() => SubscriptionsService))
        private readonly subs: SubscriptionsService,
    ) {}

    async handleConnection(client: Socket) {
        // Extraer Bearer desde handshake.auth.token
        const token = client.handshake?.auth?.token as string;
        if (!token) return client.disconnect();
        try {
            const payload = await this.jwt.verifyAsync(token, { secret: this.config.get<string>('JWT_ACCESS_SECRET') });
            (client as any).user = payload;

            // Unir al cliente a rooms de sus eventos
            const list = await this.subs.listByUser(payload.sub);
            for (const s of list) client.join(`event:${s.event.id}`);
        } catch {
            return client.disconnect();
        }
    }

    handleDisconnect(_client: Socket) {}

    // Emite actualización a suscritos de un evento
    emitEventUpdated(eventId: string) {
        this.server.to(`event:${eventId}`).emit('event-updated', { eventId });
    }

    // Emite cancelación a suscritos de un evento
    emitEventCancelled(eventId: string) {
        this.server.to(`event:${eventId}`).emit('event-cancelled', { eventId });
    }
}
