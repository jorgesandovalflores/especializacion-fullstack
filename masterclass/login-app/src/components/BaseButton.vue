<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)
</script>

<template>
  <button :type="type" class="base-button" :class="`base-button--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.base-button--primary {
  background: var(--color-primary);
  color: #ffffff;
}

.base-button--primary:hover {
  background: var(--color-primary-hover);
}

.base-button--ghost {
  background: transparent;
  color: var(--color-primary);
}
</style>
