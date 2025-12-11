<script setup lang="ts">
//import Contador from "./components/Contador.vue";
//import Interpolacion from "./components/Interpolacion.vue";
//import ClasesDinamicas from "./components/ClasesDinamicas.vue";
//import ComponentColor from "./components/ComponentColor.vue";
import ComponentCondition from "./components/ComponentCondition.vue";
</script>

<template>
    <!--<Contador />-->
    <!--<Interpolacion />-->
    <!--<ClasesDinamicas />-->
    <!--<ComponentColor />-->
    <ComponentCondition />
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
