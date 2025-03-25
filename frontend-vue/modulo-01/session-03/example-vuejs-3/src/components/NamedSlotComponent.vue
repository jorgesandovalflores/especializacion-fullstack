<template>
    <div class="named-slot">
        <header>
            <slot name="header">Encabezado por defecto</slot>
        </header>
        <main>
            <slot>Contenido principal</slot>
        </main>
        <footer>
            <slot name="footer">Pie de página por defecto</slot>
        </footer>
    </div>
</template>
  
<style>
    .named-slot {
        border: 2px solid #42b983;
        padding: 20px;
        text-align: center;
    }
</style>