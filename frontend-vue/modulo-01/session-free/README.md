# Clase: TypeScript aplicado a Vue.js (De básico a intermedio)

**Curso:** Frontend Web con Vue.js  
**Nivel:** Básico → Intermedio

---

## Objetivos de la clase

Al finalizar la clase, el estudiante será capaz de:

-   Entender qué es TypeScript y por qué se usa en Vue
-   Tipar correctamente variables, funciones y objetos
-   Usar interfaces y types en componentes Vue
-   Tipar props, emits y estados
-   Comprender inferencias, unions y propiedades opcionales
-   Aplicar TypeScript en Composition API
-   Evitar errores comunes en proyectos Vue + TypeScript

---

## 1. ¿Qué es TypeScript?

TypeScript es un **superset de JavaScript** que añade **tipado estático**, permitiendo detectar errores durante el desarrollo y no en producción.

### JavaScript vs TypeScript

JavaScript:

-   Tipado dinámico
-   Errores en runtime

TypeScript:

-   Tipado estático
-   Errores en tiempo de desarrollo
-   Ideal para proyectos medianos y grandes

Ejemplo:

```ts
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}
```

| Aspecto                     | JavaScript                       | TypeScript                     |
| --------------------------- | -------------------------------- | ------------------------------ |
| Naturaleza                  | Lenguaje interpretado            | Superset de JavaScript         |
| Tipado                      | Dinámico                         | Estático (opcional)            |
| Detección de errores        | En tiempo de ejecución (runtime) | En tiempo de desarrollo        |
| Curva de aprendizaje        | Baja                             | Media                          |
| Escalabilidad               | Difícil en proyectos grandes     | Pensado para proyectos grandes |
| Autocompletado              | Limitado                         | Muy preciso (IDE friendly)     |
| Refactorización             | Riesgosa                         | Segura                         |
| Documentación implícita     | No                               | Sí (por tipos e interfaces)    |
| Mantenimiento               | Complejo a largo plazo           | Más sencillo                   |
| Uso en Vue 3                | Opcional                         | Recomendado                    |
| Uso de interfaces           | No                               | Sí                             |
| Uso de enums / unions       | No                               | Sí                             |
| Control de contratos (APIs) | Manual                           | Tipado fuerte                  |
| Inferencia de tipos         | No                               | Sí                             |
| Soporte IDE                 | Básico                           | Avanzado                       |
| Producción                  | Más bugs potenciales             | Menos bugs                     |
| Compilación                 | No requiere                      | Requiere (tsc / Vite)          |

![Diagrama](./_img/1.png)

---

## 2. Tipos básicos

En TypeScript, **tipar una variable** significa definir explícitamente qué tipo de dato puede almacenar y qué operaciones son válidas sobre ella.  
Esto permite detectar errores **antes de ejecutar la aplicación**, algo clave en proyectos Vue medianos y grandes.

### 2.1 ¿Qué significa tipar una variable?

En JavaScript:

```js
let age = 30;
age = "treinta";
```

No ocurre ningún error.

En TypeScript:

```ts
let age: number = 30;
age = "treinta"; // Error en tiempo de desarrollo
```

TypeScript protege el código **antes de llegar a producción**.

Comparación conceptual:

| Lenguaje   | Tipado                   |
| ---------- | ------------------------ |
| JavaScript | Dinámico                 |
| Python     | Dinámico                 |
| Java       | Estático                 |
| C#         | Estático                 |
| TypeScript | Estático (en desarrollo) |

---

### 2.2 Tipos primitivos

#### string

```ts
let name: string = "Juan";
```

Comparación:

-   Java: `String name = "Juan"`
-   C#: `string name = "Juan"`

Uso real en Vue:

```ts
const title = ref<string>("Listado de usuarios");
```

---

#### number

```ts
let age: number = 30;
let price: number = 99.99;
```

A diferencia de Java o C#, TypeScript usa **un solo tipo numérico**.

Ejemplo:

```ts
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}
```

---

#### boolean

```ts
let isActive: boolean = true;
```

TypeScript evita valores ambiguos:

```ts
let isActive: boolean = "yes"; // Error
```

Uso en Vue:

```ts
const isLoading = ref<boolean>(false);
```

---

### 2.3 Inferencia de tipos

TypeScript puede inferir el tipo automáticamente:

```ts
let name = "Juan"; // string
let age = 30; // number
```

Regla práctica:

> Declara tipos cuando el dato no es obvio o viene de fuera (API, props).

---

### 2.4 Arrays

#### Forma 1: type[]

```ts
let numbers: number[] = [1, 2, 3];
```

#### Forma 2: Array<T>

```ts
let names: Array<string> = ["Ana", "Luis"];
```

Ejemplo con objetos:

```ts
interface User {
    id: number;
    name: string;
}

const users: Array<User> = [];
```

Error detectado por TypeScript:

```ts
numbers.push("cuatro"); // Error
```

---

### 2.5 Tuplas

Las tuplas son arrays con **estructura fija**:

```ts
let user: [number, string] = [1, "Carlos"];
```

Comparación:

| Lenguaje   | Equivalente      |
| ---------- | ---------------- |
| Python     | tuple            |
| C#         | (int, string)    |
| Java       | No nativo        |
| TypeScript | [number, string] |

Usos comunes:

```ts
type ApiResult = [number, string];
const result: ApiResult = [200, "OK"];
```

```ts
type Coordinates = [number, number];
const location: Coordinates = [-6.7714, -79.8409];
```

---

### 2.6 Diferencia entre Arrays y Tuplas

| Aspecto | Array      | Tupla               |
| ------- | ---------- | ------------------- |
| Tamaño  | Variable   | Fijo                |
| Tipos   | Homogéneos | Por posición        |
| Uso     | Listados   | Datos estructurados |

---

### 2.7 Ejemplo aplicado a Vue

```ts
interface Product {
    id: number;
    name: string;
    price: number;
}

const products = ref<Product[]>([]);
const selectedProduct = ref<[number, string] | null>(null);

function selectProduct(product: Product) {
    selectedProduct.value = [product.id, product.name];
}
```

---

### 2.8 Idea clave

TypeScript no se trata de escribir más código, sino de:

-   Pensar mejor los datos
-   Evitar errores silenciosos
-   Construir aplicaciones Vue escalables y mantenibles

## 3. Funciones tipadas

En TypeScript, las funciones permiten **tipar explícitamente los parámetros y el valor de retorno**, lo que ayuda a prevenir errores comunes y a escribir código más claro, predecible y mantenible, especialmente en proyectos Vue.

### 3.1 Tipar parámetros y retorno

Ejemplo básico:

```ts
function sum(a: number, b: number): number {
    return a + b;
}
```

Esto garantiza que:

-   `a` y `b` solo aceptan valores numéricos
-   El resultado siempre será un `number`

Comparación con otros lenguajes:

| Lenguaje   | Ejemplo                 |
| ---------- | ----------------------- |
| Java       | `int sum(int a, int b)` |
| C#         | `int Sum(int a, int b)` |
| Python     | No tipado en la firma   |
| JavaScript | Sin tipado              |
| TypeScript | Tipado explícito        |

Error detectado por TypeScript:

```ts
sum(10, "5"); // Error en desarrollo
```

---

### 3.2 Inferencia del tipo de retorno

TypeScript puede inferir el tipo de retorno automáticamente:

```ts
function multiply(a: number, b: number) {
    return a * b;
}
```

Regla práctica:

> Deja que TypeScript infiera el retorno cuando es obvio. Decláralo explícitamente en funciones críticas.

---

### 3.3 Funciones sin retorno (void)

```ts
function logMessage(message: string): void {
    console.log(message);
}
```

Uso común:

-   Logs
-   Eventos
-   Handlers

Ejemplo en Vue:

```ts
function handleClick(): void {
    isOpen.value = true;
}
```

---

### 3.4 Parámetros opcionales

Se definen usando `?`:

```ts
function greet(name: string, lastName?: string): string {
    return lastName ? `Hola ${name} ${lastName}` : `Hola ${name}`;
}
```

Regla importante:

> Los parámetros opcionales siempre deben ir después de los obligatorios.

---

### 3.5 Parámetros con valores por defecto

```ts
function createUser(role: string = "user"): string {
    return role;
}
```

Ejemplo práctico:

```ts
function fetchUsers(page: number = 1, limit: number = 10): void {
    // llamada a API
}
```

---

### 3.6 Arrow functions tipadas

```ts
const subtract = (a: number, b: number): number => {
    return a - b;
};
```

Inferencia automática:

```ts
const divide = (a: number, b: number) => a / b;
```

Uso común en Vue:

```ts
const closeModal = (): void => {
    isOpen.value = false;
};
```

---

### 3.7 Tipar funciones como tipos

```ts
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
```

Muy utilizado en callbacks y composables.

---

### 3.8 Callbacks tipados

```ts
function processValue(value: number, callback: (result: number) => void): void {
    callback(value * 2);
}
```

---

### 3.9 Funciones async y Promise

```ts
async function fetchData(): Promise<string> {
    return "data";
}
```

Ejemplo en Vue:

```ts
async function loadUsers(): Promise<void> {
    isLoading.value = true;
    // await axios.get(...)
    isLoading.value = false;
}
```

---

### 3.10 Ejemplo completo aplicado a Vue

```ts
interface Product {
    id: number;
    name: string;
    price: number;
}

function formatPrice(price: number): string {
    return `S/ ${price.toFixed(2)}`;
}

function selectProduct(
    product: Product,
    callback?: (id: number) => void
): void {
    callback?.(product.id);
}
```

---

### 3.11 Idea clave

Tipar funciones permite:

-   Saber exactamente qué datos entran
-   Saber exactamente qué datos salen
-   Reducir bugs
-   Escribir código Vue más confiable y profesional

## 4. Interfaces y Types

En TypeScript, **interfaces** y **types** se utilizan para definir la **estructura y forma de los datos**.  
No existen en runtime, funcionan como **contratos de desarrollo** que el código debe respetar.

Este concepto es clave en proyectos Vue para:

-   Modelar datos
-   Tipar props
-   Controlar estados
-   Definir respuestas de APIs

---

### 4.1 ¿Por qué usar Interfaces y Types?

En JavaScript:

```js
const user = {
    id: 1,
    name: "Juan",
    email: "juan@mail.com",
    isActive: true,
};
```

No hay garantías sobre la estructura.

Con TypeScript, el modelo se define antes de usarlo.

---

### 4.2 Interface

Una **interface** define la estructura que un objeto debe cumplir.

```ts
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}
```

Uso:

```ts
const user: User = {
    id: 1,
    name: "Juan",
    email: "juan@mail.com",
    isActive: true,
};
```

Si falta un campo o el tipo no coincide, TypeScript mostrará un error.

---

#### Comparación con otros lenguajes

| Lenguaje   | Equivalente       |
| ---------- | ----------------- |
| Java       | Interface / POJO  |
| C#         | Interface / Class |
| Kotlin     | Data class        |
| TypeScript | interface         |

---

### 4.2.1 Propiedades opcionales

```ts
interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}
```

Uso típico en formularios o respuestas parciales de API.

---

### 4.2.2 Interfaces extensibles

```ts
interface BaseEntity {
    id: number;
    createdAt: string;
}

interface User extends BaseEntity {
    name: string;
    email: string;
}
```

Muy útil para:

-   Modelos base
-   Entidades compartidas
-   Respuestas de API

---

### 4.2.3 Interfaces en Vue

Props tipadas:

```ts
interface Props {
    title: string;
    users: User[];
}

const props = defineProps<Props>();
```

Estados tipados:

```ts
const selectedUser = ref<User | null>(null);
```

---

### 4.3 Type

Un **type** es más flexible que una interface.  
Se utiliza principalmente para **uniones, alias y composición de tipos**.

```ts
type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
```

Uso:

```ts
const status = ref<UserStatus>("ACTIVE");
```

Evita el uso de strings mágicos.

---

#### Comparación conceptual

| Lenguaje   | Equivalente |
| ---------- | ----------- |
| Java       | enum        |
| C#         | enum        |
| Kotlin     | enum class  |
| TypeScript | union types |

---

### 4.3.1 Type como alias

```ts
type ID = number;

type User = {
    id: ID;
    name: string;
};
```

---

### 4.3.2 Composición con Type

```ts
type BaseEntity = {
    id: number;
    createdAt: string;
};

type User = BaseEntity & {
    name: string;
    email: string;
};
```

---

### 4.3.3 Types para estados en Vue

```ts
type RequestStatus = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

const status = ref<RequestStatus>("IDLE");
```

Ideal para manejar flujos de UI.

---

### 4.4 Interface vs Type

| Aspecto         | Interface      | Type           |
| --------------- | -------------- | -------------- |
| Modela objetos  | Sí             | Sí             |
| Uniones         | No             | Sí             |
| Extensión       | extends        | &              |
| Uso recomendado | Modelos, props | Estados, alias |

---

### 4.5 Regla práctica

> Usa **interface** para modelar objetos.  
> Usa **type** para estados, uniones y alias.

---

### 4.6 Ejemplo completo en Vue

```ts
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

const user = ref<User | null>(null);
const status = ref<UserStatus>("ACTIVE");

function deactivateUser(): void {
    if (user.value) {
        user.value.isActive = false;
        status.value = "INACTIVE";
    }
}
```

---

### 4.7 Idea clave

Interfaces y Types son la base para:

-   Props claras
-   Estados seguros
-   APIs bien definidas
-   Aplicaciones Vue escalables

## 5. Errores comunes

-   Usar any sin criterio
-   No tipar props
-   No tipar respuestas de API
-   Forzar tipos incorrectos

## 6. Buenas prácticas

-   Usar interfaces para modelos
-   Tipar props y emits
-   Evitar any
-   Centralizar tipos en carpeta types
-   Aprovechar inferencia de TypeScript

## Cierre

TypeScript permite escalar aplicaciones Vue con mayor seguridad, mantenibilidad y calidad profesional.
