
# 📘 Clase Avanzada – Conexiones Seguras y Escalables en Bases de Datos Relacionales con Node.js y Docker

---

## 🎯 Objetivos

Al finalizar esta sesión, el estudiante podrá:

- Entender los riesgos de seguridad asociados a conexiones sin cifrado y cómo mitigarlos con SSL/TLS.
- Implementar conexiones seguras y autenticación por certificados en MySQL y PostgreSQL.
- Separar conexiones de lectura y escritura para optimizar el rendimiento en entornos distribuidos.
- Configurar entornos seguros y escalables con Docker y NestJS.

---

## 🧭 Contenido

1. Conexiones cifradas SSL/TLS: motivos, configuración y práctica  
2. Docker + certificados: cómo levantar bases de datos seguras en contenedores  
3. Separación de conexiones de lectura y escritura: arquitectura y ejemplos reales  
4. Proyecto práctico en NestJS: estructura, providers, seguridad  

---

## 1️⃣ Conexiones cifradas SSL/TLS

### 🔐 ¿Por qué es importante?

Las conexiones sin cifrar envían credenciales, consultas y datos en texto plano, lo que expone la aplicación a ataques de tipo *man-in-the-middle*, sobre todo si:

- Te conectas a una base de datos en la nube (RDS, Azure, CloudSQL, etc.).
- Compartes red con múltiples servicios (microservicios, servidores públicos).
- Operas en entornos regulados (finanzas, salud, logística, transporte).

> ⚠️ **Ejemplo de riesgo**: Un atacante con acceso a la red puede capturar el tráfico y extraer las credenciales de conexión o datos sensibles con herramientas como Wireshark.

### 📦 Implementación: MySQL + Node.js

```ts
const pool = mysql.createPool({
  host: 'mysql-host',
  port: 3306,
  user: 'app_user',
  password: 'secret',
  database: 'secure_db',
  ssl: {
    ca: fs.readFileSync('./certs/ca.pem'),
    key: fs.readFileSync('./certs/client-key.pem'),
    cert: fs.readFileSync('./certs/client-cert.pem'),
  },
});
```

### 🐘 PostgreSQL + Node.js

```ts
const pool = new Pool({
  host: 'postgres-host',
  port: 5432,
  user: 'app_user',
  password: 'secret',
  database: 'secure_db',
  ssl: {
    rejectUnauthorized: false,
  },
});
```

---

## 2️⃣ Docker + certificados: bases de datos seguras en contenedores

### 🧪 ¿Por qué usar certificados en local o Docker?

- Permite probar **escenarios de producción** en desarrollo.
- Evita costosos errores al migrar a entornos cloud con políticas de seguridad estrictas.
- Simula entornos con TLS mutuo (cliente y servidor).

### 🔧 Paso a paso: generación de certificados

```bash
# CA raíz
openssl genrsa -out ca-key.pem 2048
openssl req -x509 -new -nodes -key ca-key.pem -sha256 -days 365 -out ca.pem

# Certificado del cliente
openssl genrsa -out client-key.pem 2048
openssl req -new -key client-key.pem -out client.csr
openssl x509 -req -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem -days 365 -sha256
```

> **Caso de uso**: Algunos servidores MySQL en producción exigen autenticación por certificado cliente, no solo usuario/contraseña.

### 🐳 Docker Compose con MySQL

```yaml
services:
  mysql_secure:
    image: mysql:8.4
    container_name: mysql_secure
    ports:
      - "3307:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - ./certs:/etc/mysql/certs:ro
      - ./custom.cnf:/etc/mysql/conf.d/custom.cnf
```

#### `custom.cnf`

```ini
[mysqld]
ssl-ca=/etc/mysql/certs/ca.pem
ssl-cert=/etc/mysql/certs/client-cert.pem
ssl-key=/etc/mysql/certs/client-key.pem
```

---

## 3️⃣ Separación de conexiones de lectura y escritura

### 🧠 ¿Por qué separar lectura y escritura?

En bases de datos distribuidas o replicadas, hay nodos especializados:

- **Primary / Master**: maneja todas las escrituras.
- **Replicas / Slaves**: permiten consultas sin bloquear al master.

Esto permite:

- Escalar horizontalmente las lecturas (más réplicas).
- Proteger la integridad del nodo principal.
- Aumentar el throughput de sistemas con más lecturas que escrituras.

#### 🚨 Ejemplos reales:

- **Plataformas de e-commerce**: muchas vistas de productos (lecturas), pocas compras (escrituras).
- **Redes sociales**: millones de vistas de perfiles, pocas ediciones.
- **Sistemas GIS o BI**: mucha lectura agregada, escritura solo desde procesos ETL.

### 🧱 Implementación en NestJS

```ts
// write-db.provider.ts
export const writePool = mysql.createPool({
  host: process.env.MYSQL_WRITER_HOST,
  user: 'write_user',
  password: 'secret',
  database: 'app',
});

// read-db.provider.ts
export const readPool = mysql.createPool({
  host: process.env.MYSQL_READER_HOST,
  user: 'read_user',
  password: 'secret',
  database: 'app',
});
```

---

## 4️⃣ Proyecto práctico: NestJS + Docker + Seguridad + Optimización

### 📁 Estructura sugerida

```
secure-backend/
├── src/
│   ├── database/
│   │   ├── write-db.provider.ts
│   │   └── read-db.provider.ts
│   └── user/user.service.ts
├── certs/
│   ├── ca.pem
│   ├── client-key.pem
│   └── client-cert.pem
├── docker-compose.yml
├── custom.cnf
└── .env
```

### 📄 `.env`

```env
MYSQL_WRITER_HOST=mysql_secure
MYSQL_READER_HOST=mysql_replica
```

---

## ✅ Conclusiones

- SSL/TLS protege tus datos en tránsito: obligatorio en cloud, recomendado siempre.
- Autenticación por certificado añade una capa de seguridad para evitar uso indebido de credenciales.
- Separar lectura y escritura permite escalar de forma eficiente en sistemas de alta demanda.
- Docker te permite simular todo este entorno desde local para prepararte para producción.
