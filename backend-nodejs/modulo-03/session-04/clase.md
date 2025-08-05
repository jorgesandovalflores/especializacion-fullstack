# Clase 04 – Módulo 03: Pruebas Unitarias en el Backend

---

## Objetivos

Al finalizar esta sesión, el estudiante será capaz de:

- Identificar los tipos de pruebas necesarias para proyectos backend.
- Implementar pruebas unitarias en NestJS con Jest.
- Entender qué y cómo testear cada tipo de componente (DTOs, DAOs, Services, Controllers).
- Probar localmente y analizar cobertura de código.
- Configurar pipelines de pruebas automatizadas en GitHub.
- Evaluar herramientas de CI/CD compatibles con reportes de pruebas y coverage.

---

## Contenido

1. Panorama general de pruebas en backend
2. ¿Qué se debe testear en NestJS?
3. Librerías necesarias para testing en NestJS
4. Ejemplos de pruebas unitarias por componente
5. Buenas prácticas, `beforeEach` y patrón AAA
6. Probar localmente y analizar cobertura
7. Configurar pipeline CI/CD con GitHub Actions
8. Herramientas para coverage en CI/CD
9. Comparación entre plataformas CI/CD

---

## 1. Panorama general de pruebas en backend

| Tipo                   | Propósito clave                                                       |
| ---------------------- | --------------------------------------------------------------------- |
| ✅ Unitarias            | Validar funciones o clases específicas sin dependencias externas.     |
| 🔗 Integración         | Verificar que múltiples módulos trabajen juntos (ej: service + DB).   |
| 🌐 End-to-End (E2E)    | Validar el flujo completo desde la entrada hasta la respuesta final.  |
| 📜 Contrato            | Verificar que una API cumple con un contrato externo (OpenAPI, Pact). |
| 🔁 Regresión           | Asegurar que nuevos cambios no rompan funcionalidades anteriores.     |
| 📈 Carga y rendimiento | Validar comportamiento bajo múltiples peticiones concurrentes.        |
| 🔐 Seguridad           | Detectar vulnerabilidades como inyecciones o accesos no autorizados.  |
| ⚙️ Pruebas en CI/CD    | Ejecutar pruebas automáticamente en cada push o pull request.         |

---

## 2. ¿Qué se debe testear en NestJS?

| Componente   | ¿Qué se prueba?                                                  |
| ------------ | ---------------------------------------------------------------- |
| DTOs         | Validaciones, tipos, restricciones (con `class-validator`).      |
| DAOs (Repos) | Consultas a base de datos: filtros, búsquedas, inserts, deletes. |
| Services     | Lógica de negocio y orquestación entre componentes.              |
| Controllers  | Endpoints HTTP, validaciones de entrada, respuestas y códigos.   |

> **DTOs no se prueban con Jest directamente**, pero pueden ser validados con `class-validator` si se requiere.

---

## 3. Librerías necesarias para testing en NestJS

Instalar Jest y utilidades:

```bash
pnpm add -D jest @nestjs/testing ts-jest @types/jest
pnpm add -D jest-html-reporter
npx ts-jest config:init
```

Archivo `jest.config.ts` recomendado:

```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: 'src',
  testRegex: '.*\.spec\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
```

---

## 44. Ejemplos de pruebas unitarias por componente

### DTO

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(6)
  password: string;
}
```

```ts
describe('CreateUserDto', () => {
  it('debe fallar si el email no es válido', async () => {
    const dto = plainToInstance(CreateUserDto, { email: 'bad', password: '123456' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

---

### DAO

```ts
@Injectable()
export class UserDao {
  constructor(private readonly repo: Repository<UserEntity>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
```

```ts
describe('UserDao', () => {
  let dao: UserDao;
  const mockRepo = { findOne: jest.fn() };

  beforeEach(() => {
    dao = new UserDao(mockRepo as any);
  });

  it('debe buscar usuario por email', async () => {
    mockRepo.findOne.mockResolvedValue({ email: 'test@mail.com' });
    const result = await dao.findByEmail('test@mail.com');
    expect(result.email).toBe('test@mail.com');
  });
});
```

---

### Service

```ts
@Injectable()
export class UserService {
  constructor(private readonly dao: UserDao) {}

  async createUser(email: string) {
    const exists = await this.dao.findByEmail(email);
    if (exists) throw new Error('Email ya registrado');
    return this.dao.save({ email });
  }
}
```

```ts
describe('UserService', () => {
  let service: UserService;
  const mockDao = {
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    service = new UserService(mockDao as any);
  });

  it('debe lanzar error si ya existe el email', async () => {
    mockDao.findByEmail.mockResolvedValue({ id: 1 });
    await expect(service.createUser('test@mail.com')).rejects.toThrow('Email ya registrado');
  });

  it('debe guardar si el email no existe', async () => {
    mockDao.findByEmail.mockResolvedValue(null);
    mockDao.save.mockResolvedValue({ id: 2, email: 'nuevo@mail.com' });

    const result = await service.createUser('nuevo@mail.com');
    expect(result.email).toBe('nuevo@mail.com');
  });
});
```

---

### Controller

```ts
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto.email);
  }
}
```

```ts
describe('UserController', () => {
  let controller: UserController;
  const mockService = { createUser: jest.fn() };

  beforeEach(() => {
    controller = new UserController(mockService as any);
  });

  it('debe delegar la creación al servicio', async () => {
    mockService.createUser.mockResolvedValue({ id: 1, email: 'a@mail.com' });
    const result = await controller.create({ email: 'a@mail.com', password: '123456' });
    expect(result.id).toBe(1);
    expect(mockService.createUser).toHaveBeenCalledWith('a@mail.com');
  });
});
```

---

## 5. Buenas prácticas y uso de `beforeEach`

- Evitar compartir estado entre pruebas.
- Crear mocks consistentes para cada test.
- Aplicar el patrón AAA: Arrange, Act, Assert.

---

## 6. Probar localmente y analizar cobertura

```bash
pnpm test
pnpm test --verbose
pnpm test --coverage
open coverage/lcov-report/index.html
```

Herramientas recomendadas:

- `jest-html-reporter`
- `coverage-badges`
- `nyc` (para Mocha)

---

## 7. Configurar pipeline CI/CD con GitHub Actions

```yaml
name: Run Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test --coverage
      - uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
```

---

## 8. Herramientas para coverage en CI/CD

| Herramienta        | Propósito                                 |
| ------------------ | ----------------------------------------- |
| Coveralls          | Integración con GitHub, genera badges.    |
| Codecov            | Visualización avanzada de cobertura.      |
| SonarCloud         | Análisis estático + métricas + seguridad. |
| jest-html-reporter | Reporte HTML portable de cobertura.       |

---

## 9. Comparación entre plataformas CI/CD

| Plataforma      | Archivo config            | Observación breve                     |
| --------------- | ------------------------- | ------------------------------------- |
| GitHub Actions  | `.github/workflows/`      | Fácil, gratis para open source.       |
| GitLab CI       | `.gitlab-ci.yml`          | Visual, flexible, runners integrados. |
| Bitbucket Pipes | `bitbucket-pipelines.yml` | Ligero, buen IDE online.              |
| Azure DevOps    | `.azure-pipelines.yml`    | Integrado a ecosistema Microsoft.     |

---

## ✅ Conclusión

- Las pruebas unitarias son el cimiento del backend.
- NestJS + Jest permite aislar y testear correctamente cada módulo.
- Ejecutar pruebas localmente y en CI/CD mejora la calidad del software.
- Herramientas de cobertura permiten medir y visualizar qué se está probando.
- GitHub Actions, GitLab CI, Bitbucket y Azure son excelentes opciones para automatización.

