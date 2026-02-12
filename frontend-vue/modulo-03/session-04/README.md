# 🎓 Clase 04 - Módulo 03: Gestión de Sesiones y Tokens en Vue.js 3

## Objetivo

Al finalizar esta clase podrás:

- Comprender las diferencias entre LocalStorage, SessionStorage y cookies HttpOnly.
- Usar tokens de acceso (`access_token`) y actualización (`refresh_token`) de manera segura.
- Implementar logout efectivo.
- Crear interceptores de Axios para renovar sesión automáticamente.
- Integrar Vue.js con un backend NestJS que gestione la autenticación de forma segura.

---

## 1. LocalStorage vs SessionStorage vs Cookies HttpOnly

| Método de almacenamiento | Persiste al cerrar navegador | Accesible por JavaScript | Seguro ante XSS | Recomendado para                    |
| ------------------------ | ---------------------------- | ------------------------ | --------------- | ----------------------------------- |
| **LocalStorage**         | ✅                           | ✅                       | ❌              | `access_token` (si no usas cookies) |
| **SessionStorage**       | ❌ (solo pestaña actual)     | ✅                       | ❌              | Estados temporales                  |
| **Cookies (HttpOnly)**   | ✅ (configurable)            | ❌                       | ✅              | `refresh_token`                     |

### Ejemplo práctico:

```ts
localStorage.setItem("access_token", "abc123");
sessionStorage.setItem("tempData", "xyz789");

const token = localStorage.getItem("access_token");
localStorage.removeItem("access_token");
sessionStorage.clear();
```

### HttpOnly Cookie

```http
Set-Cookie: refresh_token=abc123; HttpOnly; Secure; SameSite=Strict
```

> Recomendación:
>
> - `access_token`: guardar temporalmente en memoria o LocalStorage.
> - `refresh_token`: **siempre** usar HttpOnly Cookie para seguridad.

### ¿Qué es SameSite?

SameSite es un atributo de seguridad para cookies que controla si una cookie se envía o no en solicitudes "cross-site" (es decir, entre diferentes dominios/orígenes).

Se usa para proteger contra ataques de tipo CSRF (Cross-Site Request Forgery), donde un sitio malicioso intenta enviar solicitudes a otro sitio en nombre del usuario.

### Modos disponibles:

✅ SameSite=Strict (modo más seguro)

> - La cookie solo se envía si la navegación se origina desde el mismo sitio (mismo dominio).
> - No se envía en enlaces, redirecciones o formularios desde sitios externos.
> - Protege fuertemente contra CSRF.

Ejemplo:

> - ✅ Visitas tuapp.com y haces clic en un botón interno → ✅ cookie se envía.
> - ❌ Estás en facebook.com y haces clic en un link a tuapp.com → ❌ cookie no se envía.

⚠️ SameSite=Lax (modo balanceado, predeterminado)

> - Se envía en navegación de nivel superior (ej. hacer clic en un link).
> - No se envía en peticiones automáticas tipo POST desde otro sitio.
> - Es más flexible, pero menos seguro que Strict.

⚠️ SameSite=None

> - La cookie se envía en todos los contextos, incluso cross-site.
> - Requiere Secure obligatorio (HTTPS).
> - Es necesario si usas cookies en subdominios diferentes o con APIs públicas externas.

✅ ¿Cuándo usar Strict?

> - Cuando tu aplicación no necesita compartir sesión entre sitios o subdominios.
> - Cuando quieres evitar al 100% que tu cookie se envíe desde un sitio externo.
> - Ideal para el refresh_token en una SPA, ya que solo se debe usar desde tu frontend legítimo.

💡 Ejemplo real:

```ts
Set-Cookie: refresh_token=abc123; HttpOnly; Secure; SameSite=Strict
```

Esto significa:

> - Solo el navegador de miapp.com puede enviar la cookie a miapp.com.
> - Un atacante desde hacker.com no puede forzar el envío de esa cookie.

---

## 2. Tokens de Acceso y Actualización

### `access_token`

Un Access Token es un token firmado (generalmente JWT) que el cliente usa para autenticar peticiones a recursos protegidos.

#### Características:

- Tiene vida corta (ej. 15 minutos).
- Se guarda en el cliente (localStorage, memory, etc).
- Se incluye en cada request (por lo general en el header: `Authorization: Bearer ...`).

#### Ventajas:

- Ligero, rápido y sin necesidad de consulta al servidor para verificar permisos básicos.
- El backend solo lo necesita para validar y extraer el payload.

### `refresh_token`

Un Refresh Token es un token de larga duración (ej. 7 días) que permite obtener nuevos Access Tokens sin que el usuario vuelva a ingresar sus credenciales.

#### Características:

- No se envía con cada request normal.
- Se guarda en el cliente como cookie HttpOnly (más seguro).
- Solo se usa para llamar a `/auth/refresh`.
- Usualmente contiene el mismo payload que el access token, pero se valida de forma más estricta.

#### ¿Por qué separar Access y Refresh?

| Función              | Access Token           | Refresh Token           |
| -------------------- | ---------------------- | ----------------------- |
| Duración             | Corta (ej. 15 min)     | Larga (ej. 7 días)      |
| Uso                  | Cada request a APIs    | Solo para renovar token |
| Almacenamiento       | Memory / localStorage  | HttpOnly cookie (ideal) |
| Riesgo en exposición | Alto (muchas llamadas) | Bajo (uso aislado)      |

```ts
Si alguien roba un access_token, tiene pocos minutos de vida.
Si alguien roba un refresh_token, puede obtener muchos tokens. Por eso siempre debe ir en cookie HttpOnly.
```

#### Flujo completo en una SPA

```ts
[Cliente] --> POST /auth/login (email, password)
             <-- { access_token } + set-cookie refresh_token

[Cliente] guarda access_token en localStorage o memory

[Cliente] --> GET /user/me (Authorization: Bearer access_token)
             <-- Datos del usuario

(Tiempo pasa... Access Token expira)

[Cliente] --> POST /auth/refresh (usa cookie)
             <-- { nuevo access_token }

[Cliente] --> Reintenta llamada original con nuevo token

(Usuario hace logout)

[Cliente] borra access_token, backend borra refresh_token (opcional: set-cookie vencida)
```

---

## 3. Frontend Vue.js con Axios

### `api.ts` centralizado:

```ts
import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

### Interceptor de respuesta:

```ts
let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(
                    "http://localhost:3000/auth/refresh",
                    null,
                    {
                        withCredentials: true,
                    },
                );

                const newToken = res.data.access_token;
                localStorage.setItem("access_token", newToken);
                queue.forEach((p) => p.resolve(newToken));
                queue = [];

                return api(originalRequest);
            } catch (err) {
                queue.forEach((p) => p.reject(err));
                queue = [];
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
```

---

## Uso en componente Vue

```ts
<script setup lang="ts">
import { api } from '@/services/api'

const fetchUser = async () => {
	const res = await api.get('/user/me')
	console.log(res.data)
}

onMounted(fetchUser)
</script>
```

---

## Logout

```ts
const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
};
```

---

## Backend con NestJS

### Instalación

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt cookie-parser
```

### `auth.module.ts`

```ts
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "15m" },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### `auth.service.ts`

```ts
@Injectable()
export class AuthService {
    constructor(private jwt: JwtService) {}

    validateUser(email: string, password: string) {
        return email === "user@example.com" && password === "123456";
    }

    login(email: string) {
        const payload = { email };
        return {
            accessToken: this.jwt.sign(payload, { expiresIn: "15m" }),
            refreshToken: this.jwt.sign(payload, { expiresIn: "7d" }),
        };
    }

    verifyToken(token: string) {
        return this.jwt.verify(token);
    }
}
```

### `auth.controller.ts`

```ts
@Controller("auth")
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post("login")
    login(@Body() body, @Res({ passthrough: true }) res: Response) {
        const { email, password } = body;
        if (!this.auth.validateUser(email, password))
            throw new UnauthorizedException();

        const { accessToken, refreshToken } = this.auth.login(email);

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: accessToken };
    }

    @Post("refresh")
    refresh(@Req() req: Request) {
        const token = req.cookies["refresh_token"];
        if (!token) throw new UnauthorizedException();

        const payload = this.auth.verifyToken(token);
        const newAccess = this.auth.login(payload.email).accessToken;
        return { access_token: newAccess };
    }
}
```

### `user.controller.ts`

```ts
@UseGuards(AuthGuard("jwt"))
@Controller("user")
export class UserController {
    @Get("me")
    getMe(@Req() req) {
        return { email: req.user.email };
    }
}
```

### `main.ts`

```ts
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({ origin: "http://localhost:5173", credentials: true });
    await app.listen(3000);
}
```

---

## Diagrama del flujo de sesión

```
[Login View (Vue.js)]
     |
     | --> POST /auth/login
     |     -> devuelve access_token y guarda refresh_token como cookie
     |
[LocalStorage] <- access_token
[Cookie HttpOnly] <- refresh_token

     |
     | --> GET /user/me
     |     -> usa access_token en header
     |
[Expiró token?] -> Sí
     |
     | --> POST /auth/refresh
     |     -> usa refresh_token desde cookie
     |     -> devuelve nuevo access_token
     |
     | --> Retry request original
```

---

## Buenas prácticas

- No almacenes `refresh_token` en el cliente.
- Usa cookies `HttpOnly` con `Secure` y `SameSite=Strict`.
- Renueva el token con un endpoint exclusivo (`/auth/refresh`).
- Usa interceptores de Axios para automatizar la renovación.
- En backend, expira tokens antiguos cuando se renueve sesión.
