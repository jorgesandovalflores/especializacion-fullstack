<!-- App.vue -->
<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script setup lang="ts">
// No se requiere lógica por ahora
</script>

<style scoped>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	text-align: center;
}

nav {
	background-color: #2c3e50;
	padding: 1rem;
	display: flex;
	justify-content: center;
	gap: 1rem;
}

a {
	color: #ecf0f1;
	text-decoration: none;
	font-weight: bold;
}

a.router-link-exact-active {
	color: #42b983;
}
</style>
