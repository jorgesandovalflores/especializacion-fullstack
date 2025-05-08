<template>
	<div class="modal">
		<div class="popup">
			<p>¿Estás seguro que deseas eliminar a <strong>{{ user.name }}</strong>?</p>
			<div class="actions">
				<button @click="$emit('confirm')">Sí, eliminar</button>
				<button @click="$emit('close')">Cancelar</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ModelUser } from '../common/models/ModelUser';

defineProps<{
	user: ModelUser
}>()

defineEmits(['confirm', 'close'])
</script>

<style scoped>
.modal {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup {
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	text-align: center;
	width: 90%;
	max-width: 300px;
}

.actions {
	margin-top: 1rem;
	display: flex;
	justify-content: space-between;
}
</style>