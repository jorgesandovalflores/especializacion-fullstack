
# Estrategia de Índices Aplicada al Modelo Real

## ¿Qué es un índice?

Un índice es una estructura que acelera las búsquedas en una tabla. Actúa como una guía rápida para ubicar datos sin recorrer toda la tabla.

---

## ¿Por qué usar índices?

- Aceleran `SELECT`, `JOIN`, `ORDER BY`, `GROUP BY`
- Reducen el uso de CPU y disco
- Esenciales para escalabilidad

---

## ¿Cuándo no usar índices?

- Columnas con pocos valores distintos (baja cardinalidad)
- Columnas que cambian constantemente
- Columnas ya cubiertas por otros índices

---

## Tipos de índices por motor

### 🐬 MySQL

| Tipo      | Uso                          |
|-----------|------------------------------|
| `PRIMARY` | Clave primaria               |
| `UNIQUE`  | Valores únicos               |
| `INDEX`   | General                      |
| `FULLTEXT`| Texto completo (`LIKE`)     |
| `BTREE`   | Default (ordenado)           |

### 🐘 PostgreSQL

| Tipo     | Uso                                      |
|----------|-------------------------------------------|
| `BTREE`  | Default, `=`, `>`, `LIKE 'abc%'`          |
| `GIN`    | JSON, arrays, full-text (`tsvector`)     |
| `HASH`   | Solo para `=`                             |
| `BRIN`   | Tablas grandes, columnas ordenadas        |

---

## Estrategia por tabla

### ✅ `user`

```ts
@Column({ unique: true })
email: string;
```

Índice sugerido:
```sql
CREATE UNIQUE INDEX idx_user_email ON user(email);
```

Uso:
- Login y autenticación

Verificación:
```sql
SHOW INDEX FROM user;
```

---

### ✅ `order`

```ts
@ManyToOne(() => User, (user) => user.orders)
user: User;
```

Índice sugerido:
```sql
CREATE INDEX idx_order_user_id ON `order`(userId);
```

Uso:
- Obtener órdenes de un usuario

Verificación:
```sql
EXPLAIN SELECT * FROM `order` WHERE userId = 5;
```

---

### ✅ `order_item`

```ts
@ManyToOne(() => Order, (order) => order.items)
order: Order;

@ManyToOne(() => Product, (product) => product.orderItems)
product: Product;
```

Índices sugeridos:
```sql
CREATE INDEX idx_order_item_order_id ON order_item(orderId);
CREATE INDEX idx_order_item_product_id ON order_item(productId);
```

Uso:
- Obtener ítems de una orden
- Analizar productos más vendidos

Verificación:
```sql
EXPLAIN SELECT * FROM order_item WHERE productId = 2;
```

---

### ✅ `product`

```ts
@Column()
name: string;
```

Índice sugerido:
```sql
CREATE INDEX idx_product_name ON product(name);
```

Uso:
- Búsquedas por nombre

Verificación:
```sql
EXPLAIN SELECT * FROM product WHERE name = 'Zapatillas';
```

---

## Validación práctica

### `SHOW INDEX`

```sql
SHOW INDEX FROM order_item;
```

Muestra los índices creados.

### `EXPLAIN`

```sql
EXPLAIN SELECT * FROM order_item WHERE orderId = 1;
```

Revela si el índice está siendo utilizado.

---

## ✅ Conclusión

| Tabla       | Índice sugerido              | Motivo                                |
|-------------|------------------------------|----------------------------------------|
| `user`      | `UNIQUE(email)`              | Login                                  |
| `order`     | `INDEX(userId)`              | JOIN con usuario                       |
| `order_item`| `INDEX(orderId, productId)`  | JOIN y análisis                        |
| `product`   | `INDEX(name)`                | Búsqueda                               |
