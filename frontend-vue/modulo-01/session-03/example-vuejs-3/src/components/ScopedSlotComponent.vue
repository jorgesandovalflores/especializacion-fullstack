<template>
    <div class="scoped-slot">
        <slot :data="{ message: 'Mensaje desde el hijo' }"></slot>
    </div>
</template>
  
<style>
    .scoped-slot {
        padding: 20px;
        border: 2px solid #42b983;
        text-align: center;
    }
</style>