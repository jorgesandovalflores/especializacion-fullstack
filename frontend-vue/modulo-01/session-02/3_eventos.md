# Manejo de Eventos Personalizados en Vue.js con TypeScript

## 📌 Eventos Nativos (`@click`, `@input`, `@keydown`, `@keyup`, `@mouseover`, `@mouseout`)
Los eventos nativos en Vue.js permiten manejar interacciones del usuario directamente en el template.

### Componente EventosNativos.vue
```vue
<template>
  <div class="container">
    <button @click="mostrarAlerta">Haz clic aquí</button>
    <input @input="actualizarTexto" @keydown.enter="confirmarTexto" placeholder="Escribe algo" v-model="texto" />
    <p @mouseover="resaltar" @mouseout="restaurar">Pasa el mouse sobre este texto</p>
    <p>{{ mensaje }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mensaje = ref('');
const texto = ref('');

const mostrarAlerta = () => {
  alert('¡Botón clickeado!');
};

const actualizarTexto = (event: Event) => {
  const input = event.target as HTMLInputElement;
  mensaje.value = `Texto ingresado: ${input.value}`;
};

const confirmarTexto = () => {
  alert(`Texto confirmado: ${texto.value}`);
};

const resaltar = (event: Event) => {
  (event.target as HTMLElement).style.color = 'red';
};

const restaurar = (event: Event) => {
  (event.target as HTMLElement).style.color = 'black';
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}
button:hover {
  background-color: #0056b3;
}
input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
p {
  font-size: 18px;
  cursor: pointer;
}
</style>
```

## 📌 Evento Personalizado con `$emit` (Comunicación Hijo → Padre)
Los eventos personalizados permiten que un componente hijo envíe información a su componente padre.

### Componente Hijo BotonEnviar.vue
```vue
<template>
  <div class="container">
    <button @click="enviarMensaje">Enviar Mensaje</button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['mensajeEnviado']);

const enviarMensaje = () => {
  emit('mensajeEnviado', '¡Hola desde el componente hijo!');
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>
```

### Componente Padre PadreEvento.vue
```vue
<template>
  <div class="container">
    <h2>{{ mensaje }}</h2>
    <BotonEnviar @mensajeEnviado="recibirMensaje" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BotonEnviar from './BotonEnviar.vue';

const mensaje = ref('Esperando mensaje...');

const recibirMensaje = (msg: string) => {
  mensaje.value = msg;
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
h2 {
  margin-bottom: 10px;
}
</style>
```

## 📌 Emitiendo Eventos con Objetos (Múltiples Datos)
También podemos emitir eventos con objetos para enviar múltiples datos desde un hijo a su padre.

### Componente Hijo Formulario.vue
```vue
<template>
  <div class="container">
    <input v-model="nombre" placeholder="Ingresa tu nombre" />
    <button @click="enviarDatos">Enviar</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['datosEnviados']);
const nombre = ref('');

const enviarDatos = () => {
  emit('datosEnviados', { nombre: nombre.value, timestamp: new Date() });
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  text-align: center;
}
button {
  padding: 10px;
  background-color: #ffc107;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #e0a800;
}
</style>
```

### Componente Padre DatosPadre.vue
```vue
<template>
  <div class="container">
    <h2>Nombre recibido: {{ datos.nombre || 'Ninguno' }}</h2>
    <h3>Hora: {{ datos.timestamp || '---' }}</h3>
    <Formulario @datosEnviados="recibirDatos" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Formulario from './Formulario.vue';

const datos = ref<{ nombre: string; timestamp: string | null }>({ nombre: '', timestamp: null });

const recibirDatos = (info: { nombre: string; timestamp: Date }) => {
  datos.value = { nombre: info.nombre, timestamp: info.timestamp.toLocaleString() };
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
h2, h3 {
  margin-bottom: 10px;
}
</style>
```

---
Con estos ejemplos, puedes manejar eventos nativos y personalizados en Vue.js con TypeScript de manera eficiente. 🚀
