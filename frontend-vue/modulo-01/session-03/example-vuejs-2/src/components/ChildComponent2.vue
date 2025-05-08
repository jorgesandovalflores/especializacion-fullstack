<script setup lang="ts">
const emit = defineEmits(["update-message"]);
</script>

<template>
  <button class="btn" @click="emit('update-message', 'Nuevo mensaje desde el hijo!')">
    Enviar Mensaje al Padre
  </button>
</template>

<style>
.btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.btn:hover {
  background-color: #369a72;
}
</style>