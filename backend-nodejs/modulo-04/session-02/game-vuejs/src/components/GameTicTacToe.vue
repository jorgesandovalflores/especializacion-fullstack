<script setup lang="ts">
// código en inglés, comentarios en español
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { socket } from '../socket';

type Mark = 'X' | 'O';
type GameStatus = 'waiting' | 'playing' | 'finished';

interface PlayerInfo { nickname: string; mark: Mark | null; }
interface GameState {
    roomId: string;
    board: (Mark | null)[];
    turn: Mark;
    status: GameStatus;
    winner: Mark | 'draw' | null;
    players: PlayerInfo[];
}

const nickname = ref('');
const roomIdInput = ref('');
const myMark = ref<Mark | null>(null);
const state = ref<GameState | null>(null);
const errorMsg = ref('');

const isInRoom = computed(() => !!state.value?.roomId);
const isMyTurn = computed(() => state.value?.status === 'playing' && myMark.value === state.value?.turn);

function createRoom() {
    errorMsg.value = '';
    socket.emit('room:create', { nickname: nickname.value || 'Player' });
}
function joinRoom() {
    errorMsg.value = '';
    socket.emit('room:join', { roomId: roomIdInput.value.trim(), nickname: nickname.value || 'Player' });
}
function leaveRoom() {
    errorMsg.value = '';
    socket.emit('room:leave');
    myMark.value = null;
    state.value = null;
}
function playMove(index: number) {
    if (!state.value) return;
    if (state.value.status !== 'playing') return;
    if (state.value.board[index]) return;
    if (myMark.value !== state.value.turn) {
        errorMsg.value = 'Not your turn';
        return;
    }
    socket.emit('game:move', { index });
}

async function copyRoomId() {
    if (!state.value?.roomId) return;
    try {
        await navigator.clipboard.writeText(state.value.roomId);
        errorMsg.value = '';
    } catch {
        errorMsg.value = 'Could not copy Room ID';
    }
}

const statusText = computed(() => {
    if (!state.value) return 'No room';
    if (state.value.status === 'waiting') return 'Esperando un jugador...';
    if (state.value.status === 'playing') return `Turno: ${state.value.turn}`;
    if (state.value.status === 'finished') {
        if (state.value.winner === 'draw') return 'Draw!';
        return `Winner: ${state.value.winner}`;
    }
    return '';
});

const statusBadgeClass = computed(() => {
    const base = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium';
    if (!state.value) return `${base} bg-slate-700 text-slate-200`;
    switch (state.value.status) {
        case 'waiting':  return `${base} bg-sky-600/20 text-sky-300 ring-1 ring-inset ring-sky-600/40`;
        case 'playing':  return `${base} bg-emerald-600/20 text-emerald-300 ring-1 ring-inset ring-emerald-600/40`;
        case 'finished': return `${base} bg-rose-600/20 text-rose-300 ring-1 ring-inset ring-rose-600/40`;
    }
});

onMounted(() => {
    socket.on('room:created', (p: { roomId: string; mark: Mark | null }) => {
        myMark.value = p.mark;
        roomIdInput.value = p.roomId;
    });
    socket.on('room:joined', (p: { roomId: string; mark: Mark | null }) => {
        myMark.value = p.mark;
        roomIdInput.value = p.roomId;
    });
    socket.on('room:players', (p: { players: PlayerInfo[] }) => {
        if (state.value) state.value.players = p.players;
    });
    socket.on('game:state', (p: GameState) => { state.value = p; });
    socket.on('room:closed', () => {
        errorMsg.value = 'Room closed';
        myMark.value = null;
        state.value = null;
    });
    socket.on('room:error', (p: { message: string }) => {
        errorMsg.value = p.message;
    });
});
onBeforeUnmount(() => {
    socket.off('room:created');
    socket.off('room:joined');
    socket.off('room:players');
    socket.off('game:state');
    socket.off('room:closed');
    socket.off('room:error');
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
        <div class="mx-auto max-w-6xl px-4 py-10">
            <header class="mb-8 flex items-center justify-between">
                <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">
                    Tres en raya <span class="text-slate-400">(socketio / clase rooms)</span>
                </h1>
                <div v-if="state" :class="statusBadgeClass">
                    <span class="mr-2 inline-block h-2 w-2 rounded-full"
                          :class="{
                            'bg-sky-400': state?.status==='waiting',
                            'bg-emerald-400': state?.status==='playing',
                            'bg-rose-400': state?.status==='finished'
                          }"></span>
                    {{ statusText }}
                </div>
            </header>

            <div class="grid gap-6 md:grid-cols-2">
                <!-- Panel de control -->
                <section class="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl ring-1 ring-white/5 backdrop-blur">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Tu nick</label>
                            <input
                                v-model="nickname"
                                placeholder="Your name"
                                class="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <button @click="createRoom"
                                    class="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500 active:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400">
                                Crear sala
                            </button>
                            <button :disabled="!isInRoom"
                                    @click="leaveRoom"
                                    class="inline-flex items-center justify-center rounded-xl bg-slate-700 px-4 py-2 font-medium text-slate-200 hover:bg-slate-600 active:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-400">
                                Salir de la sala
                            </button>
                        </div>

                        <div>
                            <label class="block text-sm text-slate-300 mb-1">Id sala</label>
                            <div class="flex gap-2">
                                <input
                                    v-model="roomIdInput"
                                    placeholder="e.g. ab12cd"
                                    class="flex-1 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button @click="joinRoom"
                                        class="rounded-xl bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                    Unirme
                                </button>
                                <button v-if="state?.roomId" @click="copyRoomId"
                                        class="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                        title="Copy Room ID">
                                    Copiar
                                </button>
                            </div>
                            <p v-if="state?.roomId" class="mt-2 text-sm text-slate-400">
                                Sala actual: <span class="font-mono text-slate-200">{{ state.roomId }}</span>
                            </p>
                        </div>

                        <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                            <p class="text-sm">
                                <span class="text-slate-400">Tu símbolo:</span>
                                <span v-if="myMark" class="ml-2 inline-flex h-6 items-center justify-center rounded-lg bg-slate-800 px-2 font-semibold"
                                      :class="myMark==='X' ? 'text-sky-300' : 'text-emerald-300'">
                                    {{ myMark }}
                                </span>
                                <span v-else class="ml-2 text-slate-400">—</span>
                            </p>
                            <p class="mt-1 text-sm" v-if="state?.status==='playing'">
                                <span class="text-slate-400">Turno:</span>
                                <span class="ml-2 font-semibold"
                                      :class="state.turn==='X' ? 'text-sky-300' : 'text-emerald-300'">
                                    {{ state.turn }}
                                </span>
                                <span v-if="isMyTurn" class="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-200 text-xs ring-1 ring-amber-500/40">Tu turno</span>
                            </p>
                        </div>

                        <p v-if="errorMsg" class="text-sm font-medium text-rose-300">
                            {{ errorMsg }}
                        </p>

                        <p class="text-xs text-slate-500">
                            Consejo: abre esta página en dos pestañas. Crea una sala en una y únete a la otra.
                        </p>
                    </div>
                </section>

                <!-- Tablero + jugadores -->
                <section class="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl ring-1 ring-white/5 backdrop-blur">
                    <div v-if="state" class="grid gap-6">
                        <div class="grid grid-cols-3 gap-3">
                            <button
                                v-for="(cell, i) in state.board"
                                :key="i"
                                @click="playMove(i)"
                                :disabled="!!cell || state.status!=='playing' || myMark !== state.turn"
                                class="aspect-square w-full rounded-2xl border border-slate-700 bg-slate-800/70 text-5xl font-semibold
                                       transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-700
                                       focus:outline-none focus:ring-2 focus:ring-sky-400
                                       disabled:cursor-not-allowed disabled:opacity-50
                                       flex items-center justify-center"
                                :class="{
                                    'ring-2 ring-amber-400/60': isMyTurn && !cell && state.status==='playing'
                                }"
                            >
                                <span :class="cell==='X' ? 'text-sky-300' : 'text-emerald-300'">{{ cell || '' }}</span>
                            </button>
                        </div>

                        <div v-if="state?.players?.length" class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                            <h3 class="mb-3 text-sm font-semibold text-slate-300">Players</h3>
                            <ul class="space-y-2">
                                <li v-for="(p, idx) in state.players" :key="idx"
                                    class="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2">
                                    <span class="truncate">{{ p.nickname }}</span>
                                    <span class="ml-3 inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-lg px-2 font-semibold"
                                          :class="p.mark==='X' ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-600/40' : 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-600/40'">
                                        {{ p.mark ?? '—' }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-else class="flex h-full items-center justify-center text-slate-400">
                        No room joined yet.
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
