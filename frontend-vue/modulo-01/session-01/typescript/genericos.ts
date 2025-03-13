function identidad<T>(valor: T): T {
    return valor;
}
  
console.log(identidad<number>(10));
console.log(identidad<string>("Hola"));