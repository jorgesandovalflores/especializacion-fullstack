
# Clase 02 – ORM con TypeORM

## Objetivos de la clase

Al finalizar esta clase, el estudiante será capaz de:

- Comprender el rol de un ORM en aplicaciones backend y cuándo usarlo.
- Configurar TypeORM en un proyecto con NestJS.
- Modelar entidades con relaciones reales (1:1, 1:N, N:M).
- Aplicar estrategias de carga de datos (lazy y eager loading).
- Optimizar el uso de TypeORM mediante buenas prácticas y patrones comunes.
- Rebatir mitos sobre el rendimiento de los ORM con evidencia técnica.

---

## Contenido

1. ¿Qué es un ORM? Ventajas reales vs mitos comunes
2. Casos de uso donde usar un ORM tiene sentido
3. Configuración de TypeORM con NestJS
4. Modelado de entidades y relaciones reales
5. Estrategias de carga de datos: lazy vs eager
6. Uso de QueryBuilder para consultas complejas
7. Buenas prácticas y optimización

---

## Desarrollo del contenido

### 1. ¿Qué es un ORM? Ventajas reales vs mitos comunes

#### Definición

Un **ORM (Object-Relational Mapping)** permite manipular datos de una base de datos relacional usando objetos de programación. Se encarga de traducir clases en tablas, propiedades en columnas y métodos en queries SQL.

#### Ventajas prácticas

| Ventaja                  | Explicación |
|--------------------------|-------------|
| Abstracción              | El código no necesita saber de SQL. |
| Productividad            | Reduce el tiempo de desarrollo hasta un 60%. |
| Reutilización            | Las entidades se usan en servicios, validaciones, y DTOs. |
| Control de migraciones   | Permite mantener el esquema de BD versionado. |

#### Mitos comunes

| Mito                               | Realidad |
|------------------------------------|----------|
| “El ORM es más lento”              | En operaciones simples puede haber microdiferencias, pero en sistemas reales el costo en rendimiento es marginal y se compensa con la productividad. |
| “No tengo control sobre el SQL”    | TypeORM permite consultas nativas, SQL crudo y `QueryBuilder`. |
| “Solo sirve para proyectos pequeños” | Falso. TypeORM es usado en producción en proyectos grandes con millones de usuarios. |

---

### 2. Casos de uso recomendados para ORM

#### Cuándo usarlo

| Caso de uso                         | Justificación |
|-------------------------------------|---------------|
| ERP, ecommerce, redes sociales      | Modelado relacional complejo y mantenible. |
| Apps administrativas y paneles web | Rapidez en desarrollo y consistencia. |
| Backends que cambian con frecuencia | Migraciones, validaciones y escalabilidad. |

#### Cuándo **no** usarlo

- Apps con lógica en SQL altamente optimizada.
- Sistemas de alto volumen de datos que requieren acceso directo a procedimientos almacenados.
- Casos donde cada microsegundo importa (ej: trading en tiempo real).

---

### 3. Configuración de TypeORM con NestJS

#### Instalación

```bash
pnpm add @nestjs/typeorm typeorm mysql2
```

#### Módulo principal

```ts
TypeOrmModule.forRoot({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: '',
	database: 'demo',
	entities: [__dirname + '/**/*.entity{.ts,.js}'],
	synchronize: false,
	migrations: ['dist/migrations/*.js'],
	migrationsRun: true,
	logging: true,
});
```

> Nunca uses `synchronize: true` en producción.

---

### 4. Modelado de entidades y relaciones reales

#### Escenario: Sistema de pedidos

- Entidades: `User`, `Order`, `Product`, `OrderItem`

#### Entidad `User`

```ts
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Order, (order) => order.user)
	orders: Order[];
}
```

#### Entidad `Order`

```ts
@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.orders)
	user: User;

	@OneToMany(() => OrderItem, (item) => item.order)
	items: OrderItem[];
}
```

#### Entidad `OrderItem` y `Product`

```ts
@Entity()
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	quantity: number;

	@ManyToOne(() => Product, (product) => product.items)
	product: Product;

	@ManyToOne(() => Order, (order) => order.items)
	order: Order;
}

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column('decimal')
	price: number;

	@OneToMany(() => OrderItem, (item) => item.product)
	items: OrderItem[];
}
```

---


#### Relación 1:1 (Uno a uno)

```ts
@Entity()
export class Person {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Passport, (passport) => passport.person)
	@JoinColumn()
	passport: Passport;
}

@Entity()
export class Passport {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => Person, (person) => person.passport)
	person: Person;
}
```

#### Relación 1:N (Uno a muchos)

```ts
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => Order, (order) => order.user)
	orders: Order[];
}

@Entity()
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.orders)
	user: User;
}
```

#### Relación N:M (Muchos a muchos)

```ts
@Entity()
export class Student {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => Course, (course) => course.students)
	@JoinTable()
	courses: Course[];
}

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => Student, (student) => student.courses)
	students: Student[];
}
```

---

### 5. Estrategias de carga de datos

#### Eager loading (carga automática)

```ts
@OneToMany(() => Order, (order) => order.user, { eager: true })
orders: Order[];
```

#### Lazy loading (carga bajo demanda)

```ts
@OneToMany(() => Order, (order) => order.user)
orders: Promise<Order[]>;
```

#### Comparación rápida

| Tipo     | Beneficio                    | Precaución                    |
|----------|------------------------------|-------------------------------|
| Lazy     | Menor consumo inmediato      | Más queries si no se controla |
| Eager    | Simplicidad de acceso        | Sobrecarga en relaciones grandes |

---

### 6. Consultas avanzadas con QueryBuilder

```ts
const orders = await dataSource
	.getRepository(Order)
	.createQueryBuilder('order')
	.leftJoinAndSelect('order.user', 'user')
	.leftJoinAndSelect('order.items', 'items')
	.leftJoinAndSelect('items.product', 'product')
	.where('user.id = :userId', { userId: 1 })
	.getMany();
```

---

### 7. Buenas prácticas y optimización

#### ✅ Checklist

- [ ] No usar `synchronize` en producción.
- [ ] Validar DTOs con `class-validator`, no en entidades.
- [ ] Usar migraciones (`typeorm migration:generate`)
- [ ] Indexar columnas usadas en filtros o JOINs.
- [ ] Prefiere `QueryBuilder` para filtros complejos.
- [ ] Usa `@RelationId` para acceder solo a IDs relacionados.

```ts
@RelationId((order: Order) => order.user)
userId: number;
```

#### Cache, logging y paginación

- TypeORM soporta caché de queries con Redis o memoria.
- Logging solo en desarrollo.
- Pagina siempre con `.take()` y `.skip()`.

---

## Ejercicio práctico

### Objetivo: construir un microblog

- Entidades:
  - `User`, `Post`, `Comment`
- Relaciones:
  - User ↔ Post (1:N)
  - Post ↔ Comment (1:N)
- Carga:
  - `posts` eager
  - `comments` lazy
- Consulta:
  - Obtener todos los posts de un usuario con sus comentarios.
