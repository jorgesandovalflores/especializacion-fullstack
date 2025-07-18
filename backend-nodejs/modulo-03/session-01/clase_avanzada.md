# Clase Avanzada – Autenticación con SSO y Firmado de JWT

## Objetivos

- Comprender el rol de un proveedor de SSO en la arquitectura.
- Entender las diferencias entre firmas JWT simétricas y asimétricas.
- Implementar ambas formas de firma en NestJS.
- Aplicar criterios para elegir el método adecuado según el caso.

---

## 1. ¿Qué es un SSO?

**SSO (Single Sign-On)** es una estrategia donde un sistema centralizado maneja la autenticación de múltiples aplicaciones.  
En lugar de que cada servicio valide credenciales, delegan esa tarea a un **Identity Provider (IdP)** como:

- Keycloak  
- Auth0  
- Firebase Auth  
- Azure AD  
- Okta  

### Flujo típico con SSO

1. Usuario intenta acceder a app A.
2. Es redirigido al proveedor SSO.
3. Se autentica y recibe un token JWT firmado.
4. App A valida el JWT y lo acepta como prueba de identidad.
5. App B puede aceptar el mismo token (mismo dominio de confianza).

---

## 2. Separación de responsabilidades

| Componente           | Rol                                               |
|----------------------|----------------------------------------------------|
| Identity Provider    | Verifica credenciales, emite token firmado         |
| Aplicaciones cliente | Validan token, no gestionan contraseñas            |
| Backend              | Verifica firma del token, extrae claims del JWT    |

### Beneficios

- Centraliza control de acceso.
- Menor duplicación de lógica.
- Mejora seguridad.
- Facilita integración con OAuth2, LDAP, SAML.

---

## 3. Firmado de JWT

### 🔐 Simétrica (`HS256`, `HS512`, etc.)

- Usa una **clave secreta compartida** para firmar y verificar.
- Firma más rápida y simple.

```ts
jwt.sign(payload, 'mi_clave_secreta', { algorithm: 'HS256' });
```

**Riesgo**: la misma clave está en todos los servicios → más superficie de ataque.

---

### 🔐 Asimétrica (`RS256`, `ES256`, etc.)

- Usa un par de claves **privada/pública**.
  - El IdP firma con su **clave privada**.
  - Las apps verifican con la **clave pública**.

```ts
jwt.sign(payload, privateKey, { algorithm: 'RS256' });
jwt.verify(token, publicKey);
```

**Ventaja**: las apps solo necesitan la clave pública → más seguro y escalable.

---

## 4. Casos de uso

| Escenario                                       | Recomendación          |
|------------------------------------------------|------------------------|
| Microservicios internos                        | `HS256` si confías en todos |
| Integración entre servicios de distintos dominios | `RS256` con clave pública |
| Uso de Keycloak/Auth0/Azure AD                 | Siempre usan `RS256` o `ES256` |
| Clientes móviles y web                         | Asimétrico para no exponer secreto |

---

## 5. Ejemplo en NestJS

### Simétrica (`HS256`)

```ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { algorithm: 'HS256' },
});
```

### Asimétrica (`RS256`)

```ts
JwtModule.register({
  privateKey: fs.readFileSync('./private.pem'),
  publicKey: fs.readFileSync('./public.pem'),
  signOptions: { algorithm: 'RS256' },
});
```

---

## ✅ Conclusión

- SSO permite delegar autenticación y centralizar seguridad.
- JWT puede firmarse con clave compartida (rápido) o pública/privada (seguro).
- La elección depende del nivel de confianza entre servicios y la exposición al exterior.
