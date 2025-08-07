import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	ConnectedSocket
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import * as jwt from 'jsonwebtoken'

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.auth.token || client.handshake.headers['authorization']?.replace('Bearer ', '')
			if (!token) throw new Error('No token')

			const payload = jwt.verify(token, 'my_secret_key') as any
			client.data.user = { id: payload.sub, username: payload.username }
			console.log(`${payload.username} conectado`)
		} catch (err) {
			console.log('Conexión denegada: token inválido')
			client.disconnect()
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Usuario desconectado`)
	}

	@SubscribeMessage('chat_message')
	handleMessage(@MessageBody() data: { message: string }, @ConnectedSocket() client: Socket) {
		const username = client.data.user?.username || 'Anónimo'
		const msg = { user: username, message: data.message }

		console.log(`${username}: ${data.message}`)
		// Emitir mensaje a todos
		this.server.emit('chat_message', msg)
	}
}
