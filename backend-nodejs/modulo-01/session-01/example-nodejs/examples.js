/////////// Ejercicio 1: Suma de números

function add(a, b) {
  return a + b;
}

console.log(add(5, 3));    // 8
console.log(add("5", 3));  // "53" (error lógico)

/////////// Ejercicio 2: Uso de objetos sin tipado

const user = {
  name: "Ana",
  age: 25
};

console.log(user.email); // undefined

/////////// Ejercicio 3: Refactorización con enums

function getStatus(status) {
  if (status === "active") return "Activo";
  if (status === "inactive") return "Inactivo";
  return "Desconocido";
}

/////////// Ejercicio 4: Genéricos para reusabilidad

function wrapInArray(value) {
  return [value];
}

const result = wrapInArray("texto");

/////////// 5: Funciones con valores opcionales y por defecto

function greet(name) {
  name = name || "invitado";
  return `Hola, ${name}`;
}
