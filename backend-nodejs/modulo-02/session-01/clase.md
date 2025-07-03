
# 📘 Módulo 02 – Clase 01  
## Conexión a Bases de Datos Relacionales desde Node.js con NestJS

---

## 🎯 Objetivos de la clase

Al finalizar esta sesión, el estudiante podrá:

- Comprender qué es una base de datos relacional y cómo interactuar con ella desde Node.js.
- Diferenciar entre MySQL y PostgreSQL en base a su historia, arquitectura y casos de uso.
- Instalar Docker y Docker Compose correctamente.
- Levantar servicios de bases de datos como contenedores externos.
- Crear un proyecto NestJS y conectarlo a bases de datos relacionales.
- Prevenir inyección SQL y otras vulnerabilidades comunes en bases de datos.
- Aplicar prácticas seguras de conexión, autenticación y consulta de datos.

---

## 🧭 Contenido

1. Introducción a bases de datos relacionales  
2. MySQL vs PostgreSQL: historia, comparación y casos de uso  
3. Teoría e instalación de Docker y Docker Compose  
4. Configuración de contenedor externo para MySQL y PostgreSQL  
5. Creación del proyecto NestJS y conexión a la base de datos  
6. Conexiones: Single vs Pool  
7. Riesgos de seguridad comunes: inyección SQL y más  
8. Buenas prácticas de seguridad

---

## 1️⃣ Introducción a bases de datos relacionales

Una base de datos relacional organiza la información en **tablas con filas y columnas**, donde las relaciones entre datos se gestionan mediante claves. Las consultas se realizan con **SQL**.

**Ventajas:**
- Garantiza integridad con transacciones ACID.
- Fuerte modelo relacional.
- Estandarización de lenguaje (SQL).

---

## 2️⃣ MySQL vs PostgreSQL: historia, comparación y casos de uso

| Característica      | MySQL                                                | PostgreSQL                                             |
|---------------------|------------------------------------------------------|--------------------------------------------------------|
| **Origen**           | MySQL AB (1995), Oracle actualmente                 | POSTGRES (1989), PostgreSQL desde 1996, comunidad libre|
| **Licencia**         | GPL + comercial (Oracle)                            | Licencia PostgreSQL (tipo MIT)                         |
| **Velocidad lectura**| Alta, ideal para CMS, apps CRUD                     | Equilibrada con integridad y robustez                  |
| **Concurrencia**     | Con locks (puede bloquear procesos)                 | MVCC (multiversión sin bloqueos)                       |
| **JSON**             | Básico (como string, funciones limitadas)           | JSONB con índices y operadores                         |
| **Extensibilidad**   | Limitada                                            | Alta: funciones, tipos, operadores, extensiones        |
| **Estándares SQL**   | Relajado (flexible)                                 | Cumple estándares ANSI/ISO estrictos                   |
| **Escalabilidad**    | Lectura horizontal simple                           | Escritura concurrente y procesamiento analítico         |

### ✅ ¿Cuándo usar MySQL?
- Aplicaciones con gran volumen de lecturas y pocas escrituras críticas.
- CMS como WordPress, Prestashop, Magento.
- Sistemas donde la velocidad pesa más que la consistencia.

### ✅ ¿Cuándo usar PostgreSQL?
- Sistemas financieros, contables o bancarios.
- Sistemas de geolocalización (PostGIS), análisis de datos, BI.
- Servicios RESTful con estructuras JSON complejas.

---

## 3️⃣ Teoría e instalación de Docker y Docker Compose

### 🐳 ¿Qué es Docker?

Docker es una plataforma para **crear, ejecutar y administrar contenedores**, que permiten encapsular todo lo necesario para correr una aplicación.

### 📦 ¿Qué es Docker Compose?

Es una herramienta de orquestación para definir y administrar múltiples contenedores desde un solo archivo `docker-compose.yml`.

---

### ⚙️ Instalación de Docker y Docker Compose

#### 🔸 En Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

#### 🔸 En macOS/Windows

1. Descarga Docker Desktop:  
   https://www.docker.com/products/docker-desktop  
2. Incluye Docker CLI y Docker Compose por defecto.

#### 🔍 Verificar instalación

```bash
docker --version
docker compose version
```

---

## 4️⃣ Configuración de contenedor externo para MySQL y PostgreSQL

### 📁 Estructura

```
infra/
├── docker-compose.yml
└── .env
```

### 📄 `.env`

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=curso_backend
POSTGRES_PASSWORD=postgres
POSTGRES_DB=curso_backend
```

### 📄 `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.4
    container_name: mysql_db
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
    ports:
      - "3306:3306"

  postgres:
    image: postgres:16
    container_name: postgres_db
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
```

### ▶️ Comando para levantar servicios

```bash
cd infra
docker compose up -d
```

---

## 5️⃣ Creación del proyecto NestJS y conexión a base de datos

### 🧱 Crear proyecto

```bash
pnpm dlx @nestjs/cli new curso-backend-db
cd curso-backend-db
pnpm add mysql2 pg @nestjs/config dotenv
```

### 🗂 Estructura esperada

```
curso-backend-db/
├── src/
│   ├── database/
│   │   ├── mysql.provider.ts
│   │   └── postgres.provider.ts
│   └── user/user.service.ts
├── .env
```

---

## 6️⃣ Conexiones: Single vs Pool

### ❌ Single Connection

```ts
const conn = await mysql.createConnection({ ... });
const [rows] = await conn.query('SELECT * FROM users');
await conn.end();
```

### ✅ Pool Connection

```ts
const pool = mysql.createPool({ connectionLimit: 10, ... });
const [rows] = await pool.query('SELECT * FROM users');
```

---

## 7️⃣ Riesgos de seguridad comunes al trabajar con bases de datos

### 🧨 Inyección SQL

#### ❌ Vulnerable

```ts
await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
```

#### ✅ Seguro

```ts
await pool.query('SELECT * FROM users WHERE email = ?', [email]);
```

### 🚨 Otros riesgos comunes

| Riesgo                      | Descripción                                                                 |
|-----------------------------|------------------------------------------------------------------------------|
| **Fuga de credenciales**    | Variables hardcodeadas en código fuente.                                   |
| **Usuarios con privilegios excesivos** | Usuarios root usados por aplicaciones.                      |
| **Exposición del puerto a Internet** | Permitir acceso global a puertos 3306/5432 sin firewall.     |
| **Falta de logs o auditoría** | No detectar accesos irregulares o fallidos.                       |
| **Conexión sin cifrado**    | Transmitir credenciales en texto plano sin SSL/TLS.                       |
| **Datos sensibles sin cifrado** | Contraseñas o documentos sin hash ni protección en la base de datos.  |

---

## 8️⃣ Buenas prácticas de seguridad

| Práctica                    | Detalle                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| `.env`                      | Mantener credenciales y configs fuera del código                       |
| Usuarios específicos        | Crear un usuario solo con permisos `SELECT/INSERT/UPDATE`               |
| TLS/SSL                     | Activar cifrado para conexiones remotas                                |
| Hashing de datos sensibles  | Usar `bcrypt`, `argon2` para almacenar contraseñas                     |
| Auditoría y monitoreo       | Revisar logs de conexión e intentos fallidos regularmente               |
| Query parametrizado         | Siempre usar parámetros en SQL                                         |

---

## 🧪 Actividad sugerida

1. Instalar Docker y levantar los servicios MySQL/PostgreSQL con Docker Compose.
2. Crear un proyecto NestJS y conectarlo usando clientes nativos.
3. Implementar endpoints para consultar usuarios.
4. Simular una inyección SQL y aplicar la corrección.
5. Analizar qué vulnerabilidades podrían surgir y cómo mitigarlas.