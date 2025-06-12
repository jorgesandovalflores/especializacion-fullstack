/////////// Ejercicio 1: Suma de números

function add(a: number, b: number): number {
  return a + b;
}

console.log(add(5, 3));     // Ok
console.log(add("5", 3));   // Error de compilación

/////////// Ejercicio 2: Uso de objetos sin tipado

interface User {
  name: string;
  age: number;
  email?: string;
}

const user: User = {
  name: "Ana",
  age: 25
};

console.log(user.email); // undefined, pero el IDE lo advierte como opcional

/////////// Ejercicio 3: Refactorización con enums

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

function getStatus(status: Status): string {
  switch (status) {
    case Status.ACTIVE: return "Activo";
    case Status.INACTIVE: return "Inactivo";
    default: return "Desconocido";
  }
}

/////////// Ejercicio 4: Genéricos para reusabilidad

function wrapInArray<T>(value: T): T[] {
  return [value];
}

const stringArray = wrapInArray("texto");  // T = string
const numberArray = wrapInArray(42);       // T = number

/////////// 5: Funciones con valores opcionales y por defecto

function greet(name: string = "invitado"): string {
  return `Hola, ${name}`;
}
