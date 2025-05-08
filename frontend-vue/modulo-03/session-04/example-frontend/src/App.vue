<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container">
			<router-link class="navbar-brand" to="/">Example App</router-link>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarNav"
			>
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ms-auto">
					<li class="nav-item" v-if="!auth.isAuthenticated">
						<router-link class="nav-link" to="/login">Login</router-link>
					</li>
					<li class="nav-item" v-if="auth.isAuthenticated">
						<router-link class="nav-link" to="/dashboard">Dashboard</router-link>
					</li>
					<li class="nav-item" v-if="auth.isAuthenticated">
						<button class="btn btn-sm btn-outline-light ms-2" @click="logout">
							Cerrar sesión
						</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<router-view class="pt-4" />
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth.store'

const auth = useAuthStore()

const logout = () => {
	auth.logout()
	window.location.href = '/login'
}
</script>

<style>
body {
	background-color: #f8f9fa;
}
</style>

