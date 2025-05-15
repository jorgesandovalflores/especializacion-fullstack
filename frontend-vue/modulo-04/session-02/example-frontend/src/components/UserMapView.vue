<template>
	<el-container class="full-height" :style="containerStyle">
		<!-- Mapa -->
		<el-main class="map-container" :style="mapStyle">
			<div id="map-element" ref="mapElement" class="map" />
		</el-main>

		<!-- Listado de Usuarios -->
		<el-aside class="user-list" :style="listStyle">
			<el-scrollbar height="100%">
				<el-card v-for="user in users" :key="user.id" class="mb-2">
					<strong>{{ user.name }}</strong><br />
					<small>{{ user.email }}</small>
				</el-card>
			</el-scrollbar>
		</el-aside>
	</el-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
let mapConst: any = null

export type ModelUser = {
	id: string
	name: string
	email: string
	password: string
	role: string
}

const users = ref<ModelUser[]>([
	{ id: '1', name: 'Ana', email: 'ana@mail.com', password: '', role: 'admin' },
	{ id: '2', name: 'Luis', email: 'luis@mail.com', password: '', role: 'user' },
	{ id: '3', name: 'Carlos', email: 'carlos@mail.com', password: '', role: 'user' },
	{ id: '4', name: 'Maria', email: 'maria@mail.com', password: '', role: 'admin' },
	{ id: '5', name: 'Jose', email: 'jose@mail.com', password: '', role: 'user' },
	{ id: '6', name: 'Lucia', email: 'lucia@mail.com', password: '', role: 'user' },
	{ id: '7', name: 'Pedro', email: 'pedro@mail.com', password: '', role: 'user' },
	{ id: '8', name: 'Rosa', email: 'rosa@mail.com', password: '', role: 'admin' },
	{ id: '9', name: 'Diego', email: 'diego@mail.com', password: '', role: 'user' },
	{ id: '10', name: 'Elena', email: 'elena@mail.com', password: '', role: 'user' },
])

const mapElement = ref<HTMLDivElement | null>(null)

onMounted(() => {
	const loader = new Loader({
        apiKey: String(import.meta.env.VITE_GOOGLE_MAPS_APIKEY),
        version: "weekly",
        libraries: ["maps", "marker"]
    })

    loader
    .importLibrary('maps')
    .then(({Map}) => {
        mapConst = new Map(document.getElementById("map-element")!!, 
        {
            center: {
                lat: -12.046186,
                lng: -77.04198
            },
            zoom: 12,
            mapId: String(import.meta.env.VITE_MAP_ID)
        })
    })
    .catch((e) => {
        console.error(`loadMaps (error) => ${e}`)
    });
})

// estilos responsivos
const isMobile = computed(() => window.innerWidth <= 768)

const containerStyle = computed(() =>
	isMobile.value ? 'flex-direction: column;' : 'flex-direction: row;'
)

const mapStyle = computed(() =>
	isMobile.value ? 'height: 70vh; width: 100%;' : 'width: 70%; height: 100vh;'
)

const listStyle = computed(() =>
	isMobile.value ? 'height: 30vh; width: 100%; overflow: auto;' : 'width: 30%; height: 100vh; overflow: auto;'
)
</script>

<style scoped>
.full-height {
	height: 100vh;
	display: flex;
}

.map {
	width: 100%;
	height: 100%;
}

.mb-2 {
	margin-bottom: 12px;
}
</style>
