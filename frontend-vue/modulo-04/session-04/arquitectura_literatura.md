# Literatura Recomendada: Arquitectura de Software y SPAs

## Clean Architecture

### Libros Fundamentales

---

### 1. Clean Architecture: A Craftsman's Guide to Software Structure and Design
**Autor:** Robert C. Martin (Uncle Bob)
**Editorial:** Prentice Hall
**Año:** 2017

**Por qué leerlo:**
Libro de referencia obligatoria. Martin define los principios SOLID, la Regla de Dependencia y cómo organizar capas de software (Entities, Use Cases, Interface Adapters, Frameworks). Es la fuente original del término "Clean Architecture".

**Conceptos clave:**
- Dependency Rule: las capas internas no conocen las externas
- Separación entre lógica de negocio e infraestructura
- Independencia de frameworks, UI y bases de datos

---

### 2. Clean Code: A Handbook of Agile Software Craftsmanship
**Autor:** Robert C. Martin
**Editorial:** Prentice Hall
**Año:** 2008

**Por qué leerlo:**
Base conceptual antes de abordar arquitectura. Cubre nomenclatura, funciones pequeñas, manejo de errores y tests. Imprescindible para entender qué hace que el código sea mantenible.

**Conceptos clave:**
- Funciones con una sola responsabilidad
- Nombres que revelan intención
- Gestión de errores sin side effects

---

### 3. Domain-Driven Design: Tackling Complexity in the Heart of Software
**Autor:** Eric Evans
**Editorial:** Addison-Wesley
**Año:** 2003

**Por qué leerlo:**
El libro que introdujo DDD. Complementa perfectamente Clean Architecture al definir cómo modelar el dominio del negocio: Entidades, Value Objects, Aggregates, Repositories y Bounded Contexts.

**Conceptos clave:**
- Ubiquitous Language
- Bounded Contexts y Context Maps
- Aggregates y consistencia de dominio

---

### 4. Implementing Domain-Driven Design
**Autor:** Vaughn Vernon
**Editorial:** Addison-Wesley
**Año:** 2013

**Por qué leerlo:**
La versión práctica del libro de Evans. Mucho más accesible, con ejemplos concretos en código. Ideal para aplicar DDD junto con Clean Architecture en proyectos reales.

**Conceptos clave:**
- Implementación de Aggregates
- Domain Events
- Application Services vs Domain Services

---

### 5. Patterns of Enterprise Application Architecture
**Autor:** Martin Fowler
**Editorial:** Addison-Wesley
**Año:** 2002

**Por qué leerlo:**
Catálogo de patrones para organizar aplicaciones empresariales. Introduce patrones como Repository, Unit of Work, Data Mapper y Service Layer que aparecen frecuentemente en implementaciones de Clean Architecture.

**Conceptos clave:**
- Repository y Data Mapper
- Service Layer
- Domain Model vs Transaction Script

---

### 6. The Pragmatic Programmer: Your Journey to Mastery
**Autores:** David Thomas, Andrew Hunt
**Editorial:** Addison-Wesley
**Año:** 2019 (20th Anniversary Edition)

**Por qué leerlo:**
No habla de arquitectura directamente, pero forma el mindset del desarrollador. Principios como DRY, ortogonalidad y "tell, don't ask" son fundamentos de cualquier arquitectura limpia.

**Conceptos clave:**
- Don't Repeat Yourself (DRY)
- Ortogonalidad y desacoplamiento
- Coding by Coincidence vs Coding by Design

---

## Single Page Applications (SPA)

### Libros Fundamentales

---

### 7. Single Page Web Applications: JavaScript End-to-End
**Autores:** Michael Mikowski, Josh Powell
**Editorial:** Manning Publications
**Año:** 2013

**Por qué leerlo:**
Uno de los primeros libros dedicados exclusivamente a SPAs. Explica el modelo mental del desarrollo frontend moderno: estado del cliente, routing en el browser, comunicación con APIs.

**Conceptos clave:**
- Arquitectura MVC en el cliente
- Gestión del historial del navegador (History API)
- Optimización de rendimiento en el cliente

---

### 8. Vue.js: Up and Running
**Autor:** Callum Macrae
**Editorial:** O'Reilly Media
**Año:** 2018

**Por qué leerlo:**
Referencia práctica para Vue.js. Cubre componentes, Vuex, Vue Router y comunicación con APIs. Útil como complemento técnico del curso.

**Conceptos clave:**
- Component-based architecture
- Reactividad y sistema de props/events
- Integración con Vue Router y Vuex

---

### 9. Learning React: Modern Patterns for Developing React Apps
**Autores:** Alex Banks, Eve Porcello
**Editorial:** O'Reilly Media
**Año:** 2020

**Por qué leerlo:**
Aunque es React, los patrones de gestión de estado, composición de componentes y arquitectura de SPAs son transferibles a cualquier framework moderno, incluido Vue.

**Conceptos clave:**
- Composición sobre herencia
- Gestión de estado con hooks/contexto
- Flujo de datos unidireccional

---

### 10. JavaScript: The Good Parts
**Autor:** Douglas Crockford
**Editorial:** O'Reilly Media
**Año:** 2008

**Por qué leerlo:**
Clásico que sigue siendo relevante. Explica las partes sólidas del lenguaje sobre las que se construye cualquier SPA moderna: closures, prototipos, funciones de primer orden.

**Conceptos clave:**
- Closures y alcance léxico
- Objetos y herencia prototípica
- Patrones funcionales en JS

---

### 11. You Don't Know JS (serie)
**Autor:** Kyle Simpson
**Editorial:** O'Reilly Media / GitHub (open source)
**Año:** 2014-2019

**Por qué leerlo:**
Serie de seis libros que desmitifica JavaScript a profundidad. Esencial para entender cómo funciona realmente el motor de JS, el event loop, async/await y los módulos ES6 usados en toda SPA moderna.

**Conceptos clave:**
- Scope, Closures y el Event Loop
- `this` y el contexto de ejecución
- Async y Promises en profundidad

> Serie disponible de forma gratuita en GitHub: [github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)

---

### 12. High Performance Browser Networking
**Autor:** Ilya Grigorik
**Editorial:** O'Reilly Media
**Año:** 2013

**Por qué leerlo:**
Una SPA bien arquitectada debe ser también eficiente en red. Este libro cubre HTTP/2, WebSockets, caching y latencia, aspectos críticos para el rendimiento de aplicaciones frontend.

**Conceptos clave:**
- HTTP/1.1 vs HTTP/2
- WebSockets y Server-Sent Events
- Estrategias de caching y optimización de red

> Disponible de forma gratuita en: [hpbn.co](https://hpbn.co)

---

## Recursos Complementarios

| Recurso | Descripción | Acceso |
|---|---|---|
| **Clean Coders** (cleancoders.com) | Video series de Uncle Bob | Pago |
| **Martin Fowler Blog** (martinfowler.com) | Artículos sobre arquitectura y patrones | Gratis |
| **YDKJS en GitHub** | Serie completa You Don't Know JS | Gratis |
| **hpbn.co** | High Performance Browser Networking | Gratis |
| **web.dev** | Guías de rendimiento y arquitectura web de Google | Gratis |

---

## Ruta de Lectura Sugerida

```
1. Clean Code                          ← Base de código limpio
2. The Pragmatic Programmer            ← Mentalidad del desarrollador
3. Clean Architecture                  ← Principios de arquitectura
4. Domain-Driven Design (Evans)        ← Modelado del dominio
5. Implementing DDD (Vernon)           ← Aplicación práctica de DDD
6. Patterns of Enterprise Application  ← Patrones de implementación
7. JavaScript: The Good Parts          ← Fundamentos del lenguaje
8. You Don't Know JS                   ← Profundidad en JS
9. Single Page Web Applications        ← Arquitectura SPA
10. High Performance Browser Networking ← Rendimiento en red
```
