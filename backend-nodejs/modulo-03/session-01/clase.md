
# Módulo 03 – Seguridad y Autenticación
## Clase 01 – Implementación de JWT (Versión final completa)

### Objetivos

Al finalizar esta clase, el estudiante será capaz de:

- Comprender los distintos mecanismos de autenticación y autorización.
- Comparar enfoques como sesiones, OAuth2, API Keys, JWT.
- Justificar el uso de JWT con casos de uso concretos.
- Profundizar en el modelo Access Token / Refresh Token.
- Analizar problemas comunes como revocación de tokens.
- Implementar un flujo seguro de autenticación con JWT en NestJS.

---

## Contenido

1. Comparativa de mecanismos de autenticación/autorización  
2. ¿Por qué usar JWT? Casos de uso y beneficios  
3. Problemáticas comunes con JWT  
4. Profundización en Access Token vs Refresh Token  
5. Buenas prácticas de almacenamiento de tokens  
6. Preparación del proyecto NestJS para JWT  
7. Implementación completa con NestJS

---

## 1. Mecanismos de Autenticación y Autorización

| Mecanismo         | Descripción | Ventajas | Desventajas | Casos de uso comunes |
|------------------|-------------|----------|-------------|----------------------|
| **Sesiones**     | Server guarda el estado de sesión y entrega un `session_id` al cliente (normalmente vía cookie) | Fácil de invalidar, bien soportado | No escalable horizontalmente sin replicación de sesión | Web tradicionales (Laravel, Django) |
| **JWT**          | El backend entrega un token firmado con info del usuario; el token es autocontenible y sin estado | Stateless, escalable, flexible | Difícil revocación, riesgo si no se protege bien | APIs REST, SPAs, apps móviles |
| **OAuth2**       | Autenticación delegada mediante un tercero (Google, Facebook, etc.) | No gestionas contraseñas, buena UX | Complejo de implementar, requiere cliente autorizado | Apps con login social o enterprise |
| **API Keys**     | Token largo que identifica al cliente | Simple, rápido de integrar | Sin control de usuario final, difícil revocar individualmente | Integraciones entre servicios |
| **Mutual TLS**   | Validación de identidad mediante certificados cliente | Muy seguro | Complejo y costoso de implementar | Bancos, servicios críticos, sistemas internos |

---

## 2. ¿Por qué JWT?

### Ventajas prácticas

- **Stateless:** No requiere mantener sesiones en el servidor.  
- **Escalabilidad:** Ideal para arquitecturas distribuidas o con balanceadores de carga.  
- **Portable:** Funciona bien en SPAs, apps móviles, microservicios.  
- **Flexible:** Puedes incluir datos útiles (claims) como `role`, `email`, `exp`, etc.

### Casos de uso comunes

- **SPA en Vue + backend en Node.js:** El token se guarda en `localStorage` y se incluye en headers.  
- **App móvil:** El token se almacena en almacenamiento seguro del dispositivo.  
- **Arquitectura de microservicios:** El token se transmite entre servicios para validar identidad del usuario sin tener que consultar un "session store".

---

## 3. Problemáticas con JWT

### 🔄 Revocación

- Dado que JWT es **stateless**, una vez emitido no puede "revocarse" directamente.  
- **Soluciones comunes:**
  - Lista negra (`blacklist`) en Redis
  - Usar short-lived tokens (ej. 15min) + refresh tokens
  - Rotación continua de tokens

### 🔒 Almacenamiento inseguro

- Guardar JWT en `localStorage` puede exponerlo a XSS.  
- Lo recomendable: almacenar en **HttpOnly cookies** cuando sea posible.

### ⌛ Expiración

- Si el token expira, el usuario queda "afuera" sin opción de renovar.  
- Solución: usar refresh tokens que permiten renovar sin volver a hacer login.

---

## 4. Access Token vs Refresh Token

| Característica      | Access Token                        | Refresh Token                             |
|---------------------|-------------------------------------|--------------------------------------------|
| Duración            | Corta (5-30 min)                    | Larga (1-7 días, o más)                    |
| Propósito           | Acceso a recursos                   | Obtener nuevos access tokens               |
| Almacenamiento      | Memoria, localStorage o cookie      | Solo HttpOnly cookie o almacenamiento seguro |
| Frecuencia de uso   | En cada request                     | Solo cuando el access token expira         |
| Riesgo si robado    | Medio                               | Alto (permite generar más access tokens)   |
| Rotación            | Opcional, pero recomendable         | Recomendable con rotación (refresh-token rotation) |

### 🔐 Esquema recomendado

[Usuario] → Login → [Backend] →  
→ retorna: access_token (15 min), refresh_token (7 días)  
→ Cliente usa access_token para acceder  
→ Si expira → usa refresh_token para renovar

---

## 5. Buenas prácticas de almacenamiento

| Cliente       | Access Token         | Refresh Token         |
|---------------|----------------------|------------------------|
| SPA           | Memoria o localStorage | HttpOnly cookie       |
| App móvil     | Secure Storage         | Secure Storage         |
| SSR (Next.js) | HttpOnly Cookie        | HttpOnly Cookie        |

---

## 6. Preparación del Proyecto NestJS

### Crear proyecto y dependencias

```bash
nest new nest-jwt-auth
cd nest-jwt-auth
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @types/passport-jwt @types/bcrypt --save-dev
```

### Configurar .env

```env
JWT_SECRET=mi_clave
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Estructura recomendada

src/auth, src/users, ConfigModule global

---

## 7. Ejemplo completo NestJS

### DTO Login

```ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### Login

```ts
@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  if (!user) throw new UnauthorizedException('Credenciales inválidas');
  return this.authService.generateTokens(user);
}
```

### Refresh Token

```ts
@Post('refresh-token')
async refresh(@Body('refresh_token') token: string) {
  return this.authService.refreshAccessToken(token);
}
```

### Logout

```ts
@Post('logout')
logout() {
  return { message: 'Sesión cerrada correctamente' };
}
```

### Ruta protegida

```ts
@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

### JwtStrategy

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

### Generación de tokens

```ts
async generateTokens(user: UserEntity) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const access_token = await this.jwtService.signAsync(payload, {
    secret: this.config.get('JWT_SECRET'),
    expiresIn: this.config.get('JWT_EXPIRES_IN'),
  });

  const refresh_token = await this.jwtService.signAsync(payload, {
    secret: this.config.get('JWT_SECRET'),
    expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
  });

  return { access_token, refresh_token };
}
```

---

## ✅ Conclusión

JWT es ideal para sistemas distribuidos.  
Debe usarse con buenas prácticas para evitar vulnerabilidades.  
NestJS permite una implementación limpia, escalable y segura.