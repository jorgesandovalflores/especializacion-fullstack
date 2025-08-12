import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// comentario: tipos del juego
type Mark = 'X' | 'O';
type GameStatus = 'waiting' | 'playing' | 'finished';

interface Player {
    socketId: string;
    nickname: string;
    mark: Mark | null;
}

interface RoomState {
    id: string;
    players: Player[];
    board: (Mark | null)[];
    turn: Mark;
    status: GameStatus;
    winner: Mark | 'draw' | null;
}

@WebSocketGateway({
    cors: { origin: '*' },   // comentario: habilita CORS para el cliente
    namespace: '/',          // comentario: usamos el namespace por defecto
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    // comentario: memoria en vivo (mock)
    private rooms = new Map<string, RoomState>();
    private socketRoom = new Map<string, string>(); // socketId -> roomId

    handleConnection(client: Socket) {
        client.emit('hello', { message: 'welcome' });
    }

    handleDisconnect(client: Socket) {
        const roomId = this.socketRoom.get(client.id);
        if (!roomId) return;
        const room = this.rooms.get(roomId);
        if (!room) return;

        room.players = room.players.filter(p => p.socketId !== client.id);
        this.socketRoom.delete(client.id);
        client.leave(roomId);

        if (room.players.length === 0) {
            this.rooms.delete(roomId);
            this.server.to(roomId).emit('room:closed', { roomId });
        } else {
            room.status = 'waiting';
            room.winner = null;
            room.board = Array(9).fill(null);
            room.turn = 'X';
            this.server.to(roomId).emit('room:players', { players: room.players.map(p => ({ nickname: p.nickname, mark: p.mark })) });
            this.server.to(roomId).emit('game:state', this.publicState(room));
        }
    }

    // ---------- helpers ----------
    private createRoomId(): string {
        return Math.random().toString(36).slice(2, 8); // comentario: id simple
    }

    private initRoom(roomId: string): RoomState {
        const state: RoomState = {
            id: roomId,
            players: [],
            board: Array(9).fill(null),
            turn: 'X',
            status: 'waiting',
            winner: null,
        };
        this.rooms.set(roomId, state);
        return state;
    }

    private assignMarks(room: RoomState) {
        // comentario: asigna X al primero, O al segundo
        if (room.players.length === 1) {
            room.players[0].mark = 'X';
        } else if (room.players.length === 2) {
            const taken = room.players.map(p => p.mark);
            room.players[1].mark = taken.includes('X') ? 'O' : 'X';
        }
    }

    private publicState(room: RoomState) {
        return {
            roomId: room.id,
            board: room.board,
            turn: room.turn,
            status: room.status,
            winner: room.winner,
            players: room.players.map(p => ({ nickname: p.nickname, mark: p.mark })),
        };
    }

    private checkWinner(board: (Mark | null)[]): Mark | 'draw' | null {
        const lines = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6],
        ];
        for (const [a,b,c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return board.every(x => x) ? 'draw' : null;
    }

    // ---------- events from client ----------
    @SubscribeMessage('room:create')
    onRoomCreate(
        @ConnectedSocket() socket: Socket,
        @MessageBody() payload: { nickname: string },
    ) {
        const nickname = (payload?.nickname || 'Player').slice(0, 20);
        const roomId = this.createRoomId();
        const room = this.initRoom(roomId);

        socket.join(roomId);
        this.socketRoom.set(socket.id, roomId);

        const player: Player = { socketId: socket.id, nickname, mark: null };
        room.players.push(player);
        this.assignMarks(room);

        socket.emit('room:created', { roomId, mark: player.mark });
        this.server.to(roomId).emit('room:players', { players: room.players.map(p => ({ nickname: p.nickname, mark: p.mark })) });
        socket.emit('game:state', this.publicState(room));
    }

    @SubscribeMessage('room:join')
    onRoomJoin(
        @ConnectedSocket() socket: Socket,
        @MessageBody() payload: { roomId: string; nickname: string },
    ) {
        const roomId = String(payload?.roomId || '').trim();
        const nickname = (payload?.nickname || 'Player').slice(0, 20);
        const room = this.rooms.get(roomId);

        if (!room) return socket.emit('room:error', { message: 'Room not found' });
        if (room.players.length >= 2) return socket.emit('room:error', { message: 'Room is full' });

        socket.join(roomId);
        this.socketRoom.set(socket.id, roomId);

        const player: Player = { socketId: socket.id, nickname, mark: null };
        room.players.push(player);
        this.assignMarks(room);

        if (room.players.length === 2) {
            room.status = 'playing';
            room.turn = 'X';
        }

        socket.emit('room:joined', { roomId, mark: player.mark });
        this.server.to(roomId).emit('room:players', { players: room.players.map(p => ({ nickname: p.nickname, mark: p.mark })) });
        this.server.to(roomId).emit('game:state', this.publicState(room));
    }

    @SubscribeMessage('room:leave')
    onRoomLeave(@ConnectedSocket() socket: Socket) {
        const roomId = this.socketRoom.get(socket.id);
        if (!roomId) return;
        const room = this.rooms.get(roomId);
        if (!room) return;

        socket.leave(roomId);
        this.socketRoom.delete(socket.id);

        room.players = room.players.filter(p => p.socketId !== socket.id);
        if (room.players.length === 0) {
            this.rooms.delete(roomId);
            this.server.to(roomId).emit('room:closed', { roomId });
        } else {
            room.status = 'waiting';
            room.winner = null;
            room.board = Array(9).fill(null);
            room.turn = 'X';
            this.server.to(roomId).emit('room:players', { players: room.players.map(p => ({ nickname: p.nickname, mark: p.mark })) });
            this.server.to(roomId).emit('game:state', this.publicState(room));
        }
    }

    @SubscribeMessage('game:move')
    onGameMove(
        @ConnectedSocket() socket: Socket,
        @MessageBody() payload: { index: number },
    ) {
        const roomId = this.socketRoom.get(socket.id);
        if (!roomId) return socket.emit('room:error', { message: 'Not in a room' });
        const room = this.rooms.get(roomId);
        if (!room) return socket.emit('room:error', { message: 'Room missing' });
        if (room.status !== 'playing') return;

        const player = room.players.find(p => p.socketId === socket.id);
        if (!player?.mark) return;
        if (player.mark !== room.turn) return socket.emit('room:error', { message: 'Not your turn' });

        const idx = Number(payload?.index);
        if (Number.isNaN(idx) || idx < 0 || idx > 8) return;
        if (room.board[idx]) return;

        room.board[idx] = player.mark;
        const result = this.checkWinner(room.board);
        if (result) { room.status = 'finished'; room.winner = result; }
        else { room.turn = room.turn === 'X' ? 'O' : 'X'; }

        this.server.to(roomId).emit('game:state', this.publicState(room));
    }
}
