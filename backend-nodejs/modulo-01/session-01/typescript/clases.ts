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