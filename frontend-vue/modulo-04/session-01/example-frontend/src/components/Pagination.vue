<script setup lang="ts">
defineProps<{
	currentPage: number
	totalPages: number
}>()

const emit = defineEmits(['prev', 'next'])
</script>

<template>
	<div class="d-flex justify-content-center align-items-center gap-3 mt-4">
		<button
			class="btn btn-secondary"
			:disabled="currentPage <= 1"
			@click="emit('prev')"
		>
			Anterior
		</button>

		<span>Página {{ currentPage }} de {{ totalPages }}</span>

		<button
			class="btn btn-secondary"
			:disabled="currentPage >= totalPages"
			@click="emit('next')"
		>
			Siguiente
		</button>
	</div>
</template>
