<script setup lang="ts">
import { ref } from "vue";

const colors = ref([
    { name: "Azul", value: "#3498db" },
    { name: "Rojo", value: "#e74c3c" },
    { name: "Verde", value: "#2ecc71" },
    { name: "Amarillo", value: "#f1c40f" },
    { name: "Morado", value: "#9b59b6" }
]);

const selectedColor = ref(colors.value[0].value);
</script>

<template>
    <div class="container">
        <label for="colorSelect">Selecciona un color:</label>
        <select id="colorSelect" v-model="selectedColor">
            <option v-for="color in colors" :key="color.value" :value="color.value">
                {{ color.name }}
            </option>
        </select>

        <button :style="{ backgroundColor: selectedColor }" class="color-button">
            ¡Cámbiame de color!
        </button>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

select {
    padding: 5px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.color-button {
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>