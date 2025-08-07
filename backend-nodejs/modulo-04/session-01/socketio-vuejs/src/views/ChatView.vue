<template>
	<div class="h-screen flex flex-col bg-[#e5ddd5]">
		<!-- Header -->
		<header class="sticky top-0 z-10 bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow">
			<h2 class="text-base sm:text-lg font-semibold truncate">
				Chat — Hola, {{ auth.username }}
			</h2>
			<button
				@click="logout"
				class="bg-[#25d366] hover:bg-[#20b457] text-[#083f2e] font-medium px-3 py-1 rounded-md transition"
			>
				Salir
			</button>
		</header>

		<!-- Mensajes -->
		<section
			ref="scrollArea"
			class="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-2"
		>
			<div
				v-for="(msg, i) in messages"
				:key="i"
				class="flex"
				:class="isOwn(msg) ? 'justify-end' : 'justify-start'"
			>
				<!-- Burbuja -->
				<div
					class="max-w-[78%] sm:max-w-[70%] rounded-2xl px-3 py-2 shadow-md relative"
					:class="isOwn(msg)
						? 'bg-[#dcf8c6] rounded-br-sm'
						: 'bg-white rounded-bl-sm'"
				>
					<!-- Nombre (solo para otros) -->
					<p v-if="!isOwn(msg)" class="text-xs font-semibold text-[#128c7e] mb-0.5">
						{{ msg.user }}
					</p>

					<!-- Texto -->
					<p class="text-sm text-gray-900 whitespace-pre-wrap break-words">
						{{ msg.message }}
					</p>

					<!-- Hora -->
					<div class="mt-1.5 text-[10px] text-gray-500 flex items-center justify-end gap-1 select-none">
						<span>{{ formatTime(msg.ts) }}</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Input -->
		<footer class="sticky bottom-0 bg-[#f0f0f0] px-3 sm:px-4 py-2 border-t border-black/10">
			<div class="flex items-end gap-2">
				<textarea
					ref="inputEl"
					v-model="text"
					rows="1"
					@keydown.enter.prevent="send"
					@input="autoGrow"
					placeholder="Escribe un mensaje…"
					class="flex-1 resize-none max-h-40 text-sm sm:text-base rounded-xl px-3 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34b7f1]"
				/>
				<button
					@click="send"
					:disabled="!text.trim()"
					class="shrink-0 bg-[#34b7f1] hover:bg-[#2aa6dd] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-2 transition"
				>
					Enviar
				</button>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/store/useAuth'
import { io, Socket } from 'socket.io-client'

interface Message {
	user: string
	message: string
	ts: number // timestamp ms
}

const auth = useAuth()
const router = useRouter()

const text = ref('')
const messages = ref<Message[]>([])
let socket: Socket

const scrollArea = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const isOwn = (msg: Message) => msg.user === auth.username

const formatTime = (ts: number) => {
	const d = new Date(ts)
	return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
	await nextTick()
	if (scrollArea.value) {
		scrollArea.value.scrollTop = scrollArea.value.scrollHeight
	}
}

const autoGrow = () => {
	if (!inputEl.value) return
	inputEl.value.style.height = 'auto'
	inputEl.value.style.height = `${Math.min(inputEl.value.scrollHeight, 160)}px`
}

const send = () => {
	const msg = text.value.trim()
	if (!msg) return
	socket.emit('chat_message', { message: msg })
	text.value = ''
	autoGrow()
}

const logout = () => {
	try { socket?.disconnect() } catch {}
	auth.logout()
	router.push('/')
}

onMounted(() => {
	// Conexión socket
	socket = io('http://localhost:3000', {
		auth: { token: auth.token }
	})

	socket.on('connect', () => {
		// Autofocus al input al conectar
		setTimeout(() => inputEl.value?.focus(), 50)
	})

	socket.on('chat_message', (msg: { user: string; message: string }) => {
		messages.value.push({
			user: msg.user,
			message: msg.message,
			ts: Date.now()
		})
	})

	socket.on('disconnect', () => {
		// opcional: feedback de desconexión
	})
})

onUnmounted(() => {
	try { socket?.disconnect() } catch {}
})

// Auto-scroll cuando llegan mensajes
watch(messages, scrollToBottom)
</script>
