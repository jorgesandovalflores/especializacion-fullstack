<!-- components/LocalCounter.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
	count.value++
}
</script>

<template>
	<div class="counter">
		<h3>Contador Local</h3>
		<p>Valor: {{ count }}</p>
		<button @click="increment">Incrementar</button>
	</div>
</template>

<style scoped>
.counter {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 1px solid #ccc;
	padding: 1rem;
	margin: 1rem auto;
	width: 300px;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
button {
	margin-top: 0.5rem;
	padding: 0.5rem 1rem;
	cursor: pointer;
}
</style>