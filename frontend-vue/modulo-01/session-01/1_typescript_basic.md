# Introducción a TypeScript

## Instalación

Para instalar TypeScript, asegúrate de tener Node.js instalado y luego ejecuta:

```sh
npm install -g typescript
```

Verifica la instalación con:

```sh
tsc --version
```

## Creación de un archivo TypeScript

Crea un archivo `index.ts` y escribe el siguiente código:

```ts
let mensaje: string = "Hola, TypeScript";
console.log(mensaje);
```

Compila el archivo con:

```sh
tsc index.ts
```

Esto generará un archivo `index.js` que puede ejecutarse con Node.js:

```sh
node index.js
```

## Tipos de Datos

### Tipos primitivos

```ts
let nombre: string = "Juan";
let edad: number = 30;
let esDesarrollador: boolean = true;
```

### Arreglos y Tuplas

```ts
let numeros: number[] = [1, 2, 3, 4];
let tupla: [string, number] = ["Hola", 42];
```

### Enums

```ts
enum Color {
  Rojo = "Red",
  Verde = "Green",
  Azul = "Blue"
}

let colorFavorito: Color = Color.Rojo;
```

## Funciones

```ts
function saludar(nombre: string): string {
  return `Hola, ${nombre}`;
}

console.log(saludar("Carlos"));
```

## Interfaces

```ts
interface Persona {
  nombre: string;
  edad: number;
}

const usuario: Persona = {
  nombre: "Ana",
  edad: 25
};
```

## Clases

```ts
class Animal {
  nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  hacerSonido(): void {
    console.log("Sonido genérico");
  }
}

const perro = new Animal("Firulais");
perro.hacerSonido();
```

## Modificadores de Acceso

```ts
class Vehiculo {
  private marca: string;

  constructor(marca: string) {
    this.marca = marca;
  }

  obtenerMarca(): string {
    return this.marca;
  }
}

const auto = new Vehiculo("Toyota");
console.log(auto.obtenerMarca());
```

## Genéricos

```ts
function identidad<T>(valor: T): T {
  return valor;
}

console.log(identidad<number>(10));
console.log(identidad<string>("Hola"));
```

## Compilación Automática con `tsc --watch`

Para compilar automáticamente al detectar cambios, usa:

```sh
tsc --watch
```

## Configuración con `tsconfig.json`

Para configurar TypeScript en un proyecto, genera un archivo de configuración:

```sh
tsc --init
```

Esto crea un archivo `tsconfig.json` donde puedes definir opciones como el directorio de salida, versión de ECMAScript, etc.

---

Este es un resumen básico de TypeScript. ¡Experimenta y sigue explorando más características avanzadas!
