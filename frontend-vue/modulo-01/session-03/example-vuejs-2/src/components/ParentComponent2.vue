<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent2 from './ChildComponent2.vue';

const message = ref("Mensaje inicial");
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <ChildComponent2 @update-message="message = $event" />
  </div>
</template>