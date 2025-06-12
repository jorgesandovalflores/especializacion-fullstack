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