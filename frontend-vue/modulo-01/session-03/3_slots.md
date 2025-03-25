# Slots y Scoped Slots en Vue.js

En Vue.js, los **slots** son una poderosa herramienta para crear componentes flexibles y reutilizables. Permiten que un componente padre inyecte contenido dentro de un componente hijo, proporcionando una forma eficiente de estructurar la interfaz de usuario sin necesidad de redefinir la lógica del componente hijo.

## 📌 ¿Qué son los Slots en Vue.js?

Un **slot** es un marcador de posición dentro del template de un componente, donde el contenido es definido por el padre en lugar del hijo.

### ✅ Características clave de los Slots:
- **Personalización de componentes** sin alterar su estructura interna.
- **Contenido por defecto**, en caso de que el padre no pase nada.
- **Slots con nombre**, que permiten múltiples áreas de personalización dentro de un mismo componente.
- **Scoped slots**, que exponen datos del hijo al padre.

---

## 🎭 Slots Simples

Un **slot simple** permite que el componente padre inyecte contenido en el hijo.

### 📝 **Ejemplo de Slot Simple**

#### **Componente Hijo (SlotComponent.vue)**
```vue
<template>
  <div class="slot-box">
    <slot>Contenido por defecto</slot>
  </div>
</template>

<style>
.slot-box {
  padding: 20px;
  border: 2px dashed #42b983;
  text-align: center;
}
</style>
```

#### **Componente Padre (ParentComponent.vue)**
```vue
<template>
  <SlotComponent>
    <p>Este es un contenido personalizado desde el padre.</p>
  </SlotComponent>
</template>
```

---

## 🎭 Slots con Nombre

Cuando un componente tiene múltiples áreas de contenido dinámico, podemos usar **slots con nombre**.

### 📝 **Ejemplo de Slot con Nombre**

#### **Componente Hijo (NamedSlotComponent.vue)**
```vue
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
```

#### **Componente Padre (ParentComponent.vue)**
```vue
<template>
  <NamedSlotComponent>
    <template v-slot:header>
      <h2>Encabezado personalizado</h2>
    </template>
    <template v-slot:footer>
      <p>Pie de página personalizado</p>
    </template>
  </NamedSlotComponent>
</template>
```

---

## 🎭 Scoped Slots (Slots con Alcance)

Los **scoped slots** permiten que el componente hijo pase datos al padre, para que este los use dinámicamente en la plantilla.

### 📝 **Ejemplo de Scoped Slot**

#### **Componente Hijo (ScopedSlotComponent.vue)**
```vue
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
```

#### **Componente Padre (ParentComponent.vue)**
```vue
<template>
  <ScopedSlotComponent v-slot:default="slotProps">
    <p>{{ slotProps.data.message }}</p>
  </ScopedSlotComponent>
</template>
```

---

## 🛠️ Conclusión

- **Slots simples** permiten inyectar contenido dinámico en componentes.
- **Slots con nombre** permiten definir múltiples áreas personalizables.
- **Scoped slots** exponen datos del hijo al padre, dando más flexibilidad.

💡 **Consejo:** Usa slots para hacer tus componentes más reutilizables y flexibles sin necesidad de redefinir su estructura interna. 🚀

