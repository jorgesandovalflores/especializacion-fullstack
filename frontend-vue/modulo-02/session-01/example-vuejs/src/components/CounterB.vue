<!-- components/CounterB.vue -->
<script setup lang="ts">
//import { useGlobalCounterStore } from '../stores/globalCounter'
import { useStorageCounterStore } from '../stores/storageCounter'

const counter = useStorageCounterStore()
</script>

<template>
	<div class="counter">
		<h3>Componente B</h3>
		<p>Valor: {{ counter.count }}</p>
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
</style>
