# Métodos, Computed Properties y Watchers en Vue.js con TypeScript

## 📌 Métodos (`methods`)
Los métodos en Vue.js se definen dentro del `setup()` y se utilizan para ejecutar lógica en respuesta a eventos.

### Componente BotonContador.vue
```vue
<template>
  <div class="container">
    <p>Has hecho clic {{ count }} veces</p>
    <button @click="incrementar">Incrementar</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const incrementar = () => {
  count.value++;
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
button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
```

## 📌 Computed Properties (`computed`)
Las propiedades computadas se utilizan cuando un valor depende de otros valores y necesita actualizarse automáticamente.

### Componente MensajeLargo.vue
```vue
<template>
  <div class="container">
    <input v-model="mensaje" placeholder="Escribe algo" />
    <p>{{ mensajeLargo }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const mensaje = ref('');

const mensajeLargo = computed(() => {
  return mensaje.value.length > 10 ? 'Mensaje muy largo' : 'Mensaje corto';
});
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
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  text-align: center;
}
p {
  margin-top: 10px;
  font-weight: bold;
}
</style>
```

## 📌 Watchers (`watch`)
Los `watchers` observan cambios en valores y ejecutan lógica personalizada cuando un valor cambia.

### Componente Temporizador.vue
```vue
<template>
  <div class="container">
    <p>Tiempo: {{ tiempo }} segundos</p>
    <button @click="iniciar">Iniciar</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const tiempo = ref(0);

const iniciar = () => {
  tiempo.value = 0;
  const interval = setInterval(() => {
    tiempo.value++;
    if (tiempo.value >= 10) clearInterval(interval);
  }, 1000);
};

watch(tiempo, (nuevoValor) => {
  if (nuevoValor === 5) {
    alert('¡Llegaste a 5 segundos!');
  }
});
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
button {
  margin-top: 10px;
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

---
Este documento proporciona una guía clara sobre métodos, computed properties y watchers en Vue.js con TypeScript. 🚀