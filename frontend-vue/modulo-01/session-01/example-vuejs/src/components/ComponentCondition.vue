<script setup lang="ts">
import { ref } from "vue";

const cards = ref([
    { id: 1, title: "Opción 1", description: "Descripción de la Opción 1" },
    { id: 2, title: "Opción 2", description: "Descripción de la Opción 2" },
]);

const selectedCard = ref<number | null>(null);
</script>

<template>
    <div class="container">
        <div class="cards">
            <div
                v-for="card in cards"
                :key="card.id"
                class="card"
                :class="{ selected: selectedCard === card.id }"
                @click="selectedCard = card.id"
            >
                <h3>{{ card.title }}</h3>
            </div>
        </div>

        <div v-if="selectedCard !== null" class="description">
            <p style="color: black">
                {{ cards.find((c: any) => c.id === selectedCard)?.description }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
}

.cards {
    display: flex;
    gap: 10px;
}

.card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.card:hover {
    background: #f0f0f0;
}

.selected {
    background: #3498db;
    color: white;
}

.description {
    font-size: 18px;
    padding: 10px;
    background: #ecf0f1;
    border-radius: 8px;
}
</style>
