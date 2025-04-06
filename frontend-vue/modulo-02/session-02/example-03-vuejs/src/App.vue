<!-- src/App.vue -->
<template>
	<nav class="nav">
		<router-link to="/">Inicio</router-link> |
		<router-link to="/about">Acerca</router-link> |
		<router-link to="/dashboard">Dashboard</router-link>
	</nav>
	<router-view />
</template>

<style>
.nav {
	padding: 20px;
	text-align: center;
	background-color: #f5f5f5;
}
.nav a {
	margin: 0 10px;
	text-decoration: none;
	color: #333;
}
</style>