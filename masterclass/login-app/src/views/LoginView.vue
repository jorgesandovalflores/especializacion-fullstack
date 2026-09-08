<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import LoginDesktopView from './LoginDesktopView.vue'
import LoginMobileView from './LoginMobileView.vue'

const MOBILE_BREAKPOINT = 768

const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT)

function updateViewport() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
}

onMounted(() => window.addEventListener('resize', updateViewport))
onBeforeUnmount(() => window.removeEventListener('resize', updateViewport))
</script>

<template>
  <LoginMobileView v-if="isMobile" />
  <LoginDesktopView v-else />
</template>
