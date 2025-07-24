
# Clase 02 – Módulo 03: Control de Accesos y Roles

## Objetivos

- Comprender los fundamentos de los sistemas de control de acceso RBAC y ABAC.
- Implementar middleware de autorización en frameworks como Express y Koa.
- Aplicar medidas de seguridad en rutas según los roles definidos.
- Implementar estrategias para proteger datos sensibles en las aplicaciones backend.

---

## 1. Implementación de RBAC (Role-Based Access Control)

### ¿Qué es el Control de Acceso?

El control de acceso es una estrategia fundamental de seguridad que garantiza que solo usuarios autorizados puedan acceder a ciertos recursos o ejecutar acciones específicas dentro de una aplicación.

Existen dos enfoques principales:

### RBAC (Role-Based Access Control)

RBAC se basa en asignar **roles** a los usuarios, y esos roles determinan los permisos.

#### Ventajas:
- Simple y escalable.
- Fácil de auditar y mantener.

#### Ejemplo:
```json
{
  "user_id": 1,
  "role": "admin"
}
```

El sistema define qué puede hacer cada rol:
```js
const roles = {
  admin: ['create_user', 'delete_user', 'view_reports'],
  user: ['view_profile']
}
```

#### Caso de uso:
Una plataforma de administración en la que:
- Los administradores pueden crear usuarios.
- Los supervisores solo pueden ver reportes.
- Los usuarios regulares solo pueden ver su perfil.

### ABAC (Attribute-Based Access Control)

ABAC considera **atributos** del usuario, del recurso y del contexto. Es más flexible, pero más complejo.

#### Ejemplo:
- Solo permitir ver reportes si el usuario tiene el rol `supervisor` **y** la región del usuario es la misma que la del reporte.

#### Caso de uso:
Un sistema financiero que permite ver reportes solo si el usuario está en la misma zona geográfica que el reporte solicitado y tiene el atributo `permiso_consulta_avanzada`.

#### Comparación:
| Característica      | RBAC                        | ABAC                                |
|---------------------|-----------------------------|--------------------------------------|
| Basado en           | Roles                       | Atributos                            |
| Complejidad         | Baja                        | Alta                                 |
| Flexibilidad        | Media                       | Alta                                 |
| Escenarios ideales  | Aplicaciones administrativas| Sistemas con reglas dinámicas        |

---

## 2. Middleware de autorización en Express/Koa

En ambos frameworks, se pueden usar middlewares para controlar el acceso a rutas según roles o atributos.

### Express

```js
function authorize(roles = []) {
  return (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
```

Uso:
```js
app.get('/admin/dashboard', authorize(['admin']), handler);
```

### Koa

```js
const authorize = (roles = []) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!roles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = { message: 'Access denied' };
      return;
    }
    await next();
  };
};
```

Uso:
```js
router.get('/admin/dashboard', authorize(['admin']), handler);
```

---

## 3. Seguridad en rutas y permisos

### Buenas prácticas:

- Usar middlewares para proteger rutas sensibles.
- Evitar confiar solo en el frontend para validar roles.
- Registrar todos los accesos denegados (logs).
- Implementar "defense in depth": varias capas de seguridad.

### Organización de rutas

Agrupar rutas por módulo y aplicar middlewares a nivel de grupo:

```js
app.use('/admin', authorize(['admin']), adminRouter);
```

También se pueden validar permisos específicos:

```js
function hasPermission(permission) {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
}
```

---

## 4. Estrategias de protección de datos sensibles

Los datos sensibles pueden incluir:
- Datos personales (nombre, dirección, teléfono)
- Tokens y credenciales
- Información financiera
- Datos de salud

### Estrategias:

#### a. Enmascaramiento de datos (Masking)
Mostrar solo una parte del dato:
```js
const maskEmail = (email) => {
  const [user, domain] = email.split('@');
  return user[0] + '***@' + domain;
};
```

#### b. Cifrado de datos
- **En reposo:** cifrar con AES, bcrypt, etc.
- **En tránsito:** usar HTTPS (TLS).

#### c. Acceso granular a datos
Controlar quién ve qué información.

```js
if (user.role !== 'admin') {
  delete user.ssn;
}
```

#### d. Registro de accesos
Guardar logs detallados sobre quién accede a qué dato y cuándo.

---

## 5. Resumen y buenas prácticas

- Elige RBAC para sistemas con jerarquías claras; ABAC si necesitas mayor granularidad.
- Centraliza la lógica de autorización con middlewares reutilizables.
- Nunca confíes solo en validaciones frontend.
- Protege los datos sensibles aplicando cifrado, control de acceso y enmascaramiento.
- Usa herramientas como JWT para gestionar identidades y permisos.
- Audita y registra todos los accesos a recursos críticos.

---

## Ejercicio práctico sugerido

> Implementa un sistema básico de RBAC en Express donde existan tres rutas:
> - `/profile` (acceso libre para usuarios autenticados)
> - `/admin/users` (solo admins)
> - `/reports` (usuarios con permiso `view_reports`)
>
> Implementa un middleware `authorize` y un esquema de usuarios mock con distintos roles y permisos.
