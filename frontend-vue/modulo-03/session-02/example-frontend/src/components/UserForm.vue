<template>
	<div class="modal">
		<div class="form-box">
			<h2>{{ user?.id ? 'Editar Usuario' : 'Registrar Usuario' }}</h2>
			<form @submit.prevent="submit">
				<input v-model="form.name" placeholder="Nombre" required />
				<input v-model="form.email" type="email" placeholder="Email" required />
				<input v-model="form.password" type="password" placeholder="Contraseña" required />

				<p v-if="userStore.error" class="error">
					{{ userStore.error.message }}
				</p>

				<div class="form-actions">
					<button type="submit">Guardar</button>
					<button type="button" @click="$emit('close')">Cancelar</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/useUserStore'
import type { ModelUser } from '../common/models/ModelUser';
import MapperUser from '../common/mappers/MapperUser';

const userStore = useUserStore()

const props = defineProps<{ user: ModelUser | null }>()
const emit = defineEmits<{
	(e: 'save', user: ModelUser): void
	(e: 'close'): void
}>()

const form = ref<ModelUser>(MapperUser.toEmpty())

watch(() => props.user, (val) => {
	if (val) form.value = { ...val }
	else form.value = MapperUser.toEmpty()
}, { immediate: true })

async function submit() {
	await emit('save', { ...form.value })
}
</script>

<style scoped>
.modal {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.form-box {
	background: white;
	padding: 2rem;
	border-radius: 8px;
	width: 100%;
	max-width: 400px;
	text-align: center;
}

form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

input {
	padding: 0.5rem;
	font-size: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.form-actions {
	display: flex;
	justify-content: space-between;
	margin-top: 1rem;
}

.error {
	color: red;
	font-size: 0.9rem;
}
</style>
