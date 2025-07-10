
# Clase 03 – Relaciones y Optimización de Consultas

## 🎯 Objetivos

Al finalizar esta clase, el estudiante podrá:

- Comprender los distintos tipos de relaciones en bases de datos relacionales y cuándo aplicarlos.
- Usar `QueryBuilder` para construir consultas eficientes y legibles.
- Analizar y aplicar índices para mejorar el rendimiento en consultas complejas.
- Implementar un mecanismo básico de caché con Redis para evitar consultas innecesarias a la base de datos.

---

## 📚 Contenido

1. Tipos de relaciones entre entidades: 1:1, 1:N, N:M
2. Construcción de consultas optimizadas con QueryBuilder
3. Índices: teoría, aplicación y medición de performance
4. Caché de datos con Redis: concepto, beneficios y uso práctico

---

## 1 Relaciones entre entidades

### ¿Qué es una relación en bases de datos?

Una relación representa cómo dos entidades (tablas) se vinculan entre sí. Comprender bien estas relaciones permite modelar la realidad de un negocio y optimizar el acceso a los datos.

---

### Relación Uno a Uno (1:1)

**Definición:** Una fila en la tabla A se relaciona con una única fila en la tabla B y viceversa.

**Caso de uso:**  
- Un `Usuario` tiene un `Perfil` que contiene información adicional como foto, biografía, redes sociales.

```ts
// user.entity.ts
@OneToOne(() => Profile, (profile) => profile.user)
@JoinColumn()
profile: Profile;
```

**Ventajas:**
- Modulariza datos poco usados.
- Mejora la performance si usamos `lazy loading`.

---

### Relación Uno a Muchos / Muchos a Uno (1:N / N:1)

**Definición:** Una fila en la tabla A puede relacionarse con muchas filas en la tabla B. Es la relación más común.

**Caso de uso:**
- Un `Cliente` puede tener muchos `Pedidos`.

```ts
// customer.entity.ts
@OneToMany(() => Order, (order) => order.customer)
orders: Order[];
```

**Comparación:**

| Relación | Uso típico | Costo de join |
|----------|------------|---------------|
| 1:1 | Datos opcionales | Bajo |
| 1:N | Historiales, actividades | Medio |

---

### Relación Muchos a Muchos (N:M)

**Definición:** Muchas filas de la tabla A se relacionan con muchas filas de la tabla B. Requiere tabla intermedia.

**Caso de uso:**
- `Producto` puede estar en varias `Categorías`.

```ts
@ManyToMany(() => Category, (category) => category.products)
@JoinTable()
categories: Category[];
```

**Visual:**

```
PRODUCTO       CATEGORÍA
---------      ----------
Zapatos   -->  Moda
Zapatos   -->  Ofertas
Camisa    -->  Moda
```

---

## 2. Consultas optimizadas con QueryBuilder

### ¿Por qué usar `QueryBuilder`?

Cuando necesitas condiciones dinámicas, joins condicionales, paginación o agregaciones.

### Caso real:

**"Mostrar pedidos con productos y total filtrado por fecha."**

```ts
const orders = await dataSource
  .getRepository(Order)
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.products', 'product')
  .leftJoinAndSelect('order.customer', 'customer')
  .where('customer.id = :customerId', { customerId })
  .andWhere('order.createdAt BETWEEN :from AND :to', { from, to })
  .orderBy('order.createdAt', 'DESC')
  .getMany();
```

---

## 3. Índices e impacto en el rendimiento

### ¿Qué es un índice?

Una estructura que acelera búsquedas y joins.

**Ejemplo:**
```sql
CREATE INDEX idx_user_email ON users(email);
```

**Ventajas y costo:**

| Ventaja | Costo |
|--------|--------|
| Lecturas rápidas | Insert/Update más lentos |
| Menos I/O | Uso de disco |

---

## 4. Caché con Redis

### ¿Por qué Redis?

- Rápido, en memoria.
- Reduce carga a DB.

**Ejemplo:**

```ts
const key = `user:${userId}`;
const cached = await redis.get(key);

if (cached) return JSON.parse(cached);

const user = await this.userRepository.findOneBy({ id: userId });
await redis.set(key, JSON.stringify(user), 'EX', 60);
return user;
```

---

## Actividad propuesta

1. Entidades: `Student`, `Course`, `Teacher`, `Enrollment`
2. Relaciones:
   - `Student` ⇄ `Course`: muchos a muchos
   - `Course` → `Teacher`: muchos a uno
3. QueryBuilder: listar estudiantes de un curso ordenado por apellido
4. Índice: en `lastName` y `courseId`
5. Caché: lista de cursos por alumno (TTL: 60s)
