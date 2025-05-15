<template>
	<div class="home-container" :style="{ backgroundColor: primaryColor }">
		<el-card class="home-card">
			<h1>{{ appName }}</h1>
			<p>{{ homeMessage }}</p>

			<div class="button-group">
				<el-button type="primary" @click="goToMap">Ir al Mapa</el-button>
				<el-button type="success" @click="sayHello">Mostrar Alerta</el-button>
				<el-button type="warning" @click="reloadPage">Recargar</el-button>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const appName = import.meta.env.VITE_APP_NAME
const primaryColor = import.meta.env.VITE_PRIMARY_COLOR
const homeMessage = import.meta.env.VITE_HOME_MESSAGE

const goToMap = () => router.push('/map')
const sayHello = () => ElMessage.success('¡Hola desde ' + appName + '!')
const reloadPage = () => location.reload()
</script>

<style scoped>
.home-container {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	transition: background-color 0.3s ease;
}

.home-card {
	width: 100%;
	max-width: 500px;
	text-align: center;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 12px;
	box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.button-group {
	margin-top: 20px;
	display: flex;
	justify-content: space-around;
}
</style>
