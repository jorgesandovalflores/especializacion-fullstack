# Clase 02 — Módulo 01  
## Manejo del estado local en Vue.js 3

---

## Objetivos

- Comprender cómo se maneja el estado local en componentes Vue.
- Aplicar correctamente el binding de propiedades entre lógica y UI.
- Comunicar componentes usando Props y Emits de forma clara y tipada.
- Reutilizar componentes mediante Slots y Scoped Slots.

---

## Contenido

- Propiedades y binding en Vue.js  
- Comunicación entre componentes (Props y Emits)  
- Slots y scoped slots  

---

## 1. Propiedades y binding en Vue.js

El estado local en Vue vive dentro del componente y se gestiona mediante variables reactivas. Este estado se enlaza a la vista usando directivas de binding.

### 1.1 Estado local con `ref` y `reactive`

- `ref()` se usa para valores primitivos.
- `reactive()` se usa para objetos.

```vue
<!-- CounterCard.vue -->
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";

const count = ref<number>(0);

const form = reactive({
	name: "",
	email: ""
});

const doubled = computed(() => count.value * 2);

const increment = () => {
	count.value++;
};
</script>

<template>
	<section>
		<h2>Counter</h2>

		<p>Count: {{ count }}</p>
		<p>Doubled: {{ doubled }}</p>

		<button type="button" @click="increment">
			Increment
		</button>

		<hr />

		<label>
			Name
			<input v-model="form.name" type="text" />
		</label>

		<label>
			Email
			<input v-model="form.email" type="email" />
		</label>

		<p>{{ form }}</p>
	</section>
</template>
```

---

### 1.2 Binding con `v-bind` y `v-model`

- `v-bind` (`:`) enlaza atributos dinámicos.
- `v-model` permite two-way binding.

```vue
<script lang="ts" setup>
import { computed, ref } from "vue";

const disabled = ref<boolean>(false);
const size = ref<"sm" | "md" | "lg">("md");

const classes = computed(() => ({
	"btn": true,
	"btn-sm": size.value === "sm",
	"btn-md": size.value === "md",
	"btn-lg": size.value === "lg"
}));
</script>

<template>
	<button :class="classes" :disabled="disabled">
		Save
	</button>

	<label>
		Disabled
		<input v-model="disabled" type="checkbox" />
	</label>

	<select v-model="size">
		<option value="sm">Small</option>
		<option value="md">Medium</option>
		<option value="lg">Large</option>
	</select>
</template>
```

---

### 1.3 Buenas prácticas del estado local

- Mantener el estado cerca del componente que lo usa.
- Subir el estado al padre cuando varios hijos lo necesitan.
- Usar `computed` para valores derivados y evitar duplicar estado.

---

## 2. Comunicación entre componentes (Props y Emits)

La comunicación entre componentes sigue una regla clara:

- Props: datos del padre hacia el hijo.
- Emits: eventos del hijo hacia el padre.

### 2.1 Props (padre → hijo)

```vue
<!-- UserCard.vue -->
<script lang="ts" setup>
type User = {
	id: number;
	name: string;
	role: "admin" | "user";
};

const props = withDefaults(
	defineProps<{
		user: User;
		compact?: boolean;
	}>(),
	{
		compact: false
	}
);
</script>

<template>
	<article>
		<h3>{{ props.user.name }}</h3>
		<p v-if="!props.compact">Role: {{ props.user.role }}</p>
	</article>
</template>
```

```vue
<!-- ViewUsers.vue -->
<script lang="ts" setup>
import { ref } from "vue";
import UserCard from "./UserCard.vue";

const users = ref([
	{ id: 1, name: "Ana", role: "admin" as const },
	{ id: 2, name: "Luis", role: "user" as const }
]);

const compact = ref(false);
</script>

<template>
	<label>
		Compact
		<input type="checkbox" v-model="compact" />
	</label>

	<UserCard
		v-for="u in users"
		:key="u.id"
		:user="u"
		:compact="compact"
	/>
</template>
```

---

### 2.2 Emits (hijo → padre)

```vue
<!-- UserCard.vue -->
<script lang="ts" setup>
type User = {
	id: number;
	name: string;
	role: "admin" | "user";
};

const props = defineProps<{ user: User }>();

const emit = defineEmits<{
	(e: "select", userId: number): void;
	(e: "remove", payload: { userId: number; reason?: string }): void;
}>();

const onSelect = () => {
	emit("select", props.user.id);
};

const onRemove = () => {
	emit("remove", { userId: props.user.id, reason: "manual" });
};
</script>

<template>
	<article>
		<h3>{{ props.user.name }}</h3>

		<button type="button" @click="onSelect">
			Select
		</button>

		<button type="button" @click="onRemove">
			Remove
		</button>
	</article>
</template>
```

---

### 2.3 `v-model` en componentes

```vue
<!-- BaseTextInput.vue -->
<script lang="ts" setup>
const props = defineProps<{
	modelValue: string;
	label?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const onInput = (e: Event) => {
	const target = e.target as HTMLInputElement;
	emit("update:modelValue", target.value);
};
</script>

<template>
	<label>
		<span v-if="label">{{ label }}</span>
		<input :value="modelValue" type="text" @input="onInput" />
	</label>
</template>
```

---

## 3. Slots y scoped slots

Los slots permiten reutilizar componentes sin perder flexibilidad de renderizado.

### 3.1 Slot por defecto

```vue
<!-- Card.vue -->
<script lang="ts" setup>
const props = defineProps<{ title: string }>();
</script>

<template>
	<section>
		<header>
			<h3>{{ props.title }}</h3>
		</header>

		<div>
			<slot />
		</div>
	</section>
</template>
```

---

### 3.2 Slots nombrados

```vue
<!-- Modal.vue -->
<script lang="ts" setup>
const props = defineProps<{ open: boolean }>();
</script>

<template>
	<div v-if="props.open">
		<header>
			<slot name="title" />
		</header>

		<section>
			<slot />
		</section>

		<footer>
			<slot name="actions" />
		</footer>
	</div>
</template>
```

---

### 3.3 Scoped slots

```vue
<!-- ListRenderer.vue -->
<script lang="ts" setup>
const props = defineProps<{
	items: string[];
}>();
</script>

<template>
	<ul>
		<li v-for="(item, index) in props.items" :key="index">
			<slot name="item" :item="item" :index="index">
				{{ item }}
			</slot>
		</li>
	</ul>
</template>
```

---

## Cierre de la clase

- El estado local se maneja con `ref`, `reactive` y `computed`.
- Props y Emits definen la comunicación entre componentes.
- `v-model` estandariza el intercambio de valores.
- Slots y scoped slots permiten construir componentes altamente reutilizables.
