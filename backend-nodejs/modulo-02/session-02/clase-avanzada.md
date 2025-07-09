
# Clase Avanzada – Relaciones entre Entidades en Microservicios

## Objetivos

Al finalizar esta clase, el estudiante será capaz de:

- Comprender los fundamentos y principios de la arquitectura de componentes y microservicios.
- Identificar diferencias entre monolito, modular monolith y microservicios.
- Modelar relaciones entre entidades en entornos distribuidos.
- Aplicar estrategias efectivas según el contexto del dominio.

---

## Contenido

1. Principios de la arquitectura de componentes  
2. Introducción a la arquitectura de microservicios  
3. Comparación: Monolito vs Modular Monolith vs Microservicios  
4. Principio Database-per-Service  
5. Estrategias de relación entre servicios:  
   - API Composition  
   - Event-Driven Aggregation  
   - Comunicación síncrona  
6. Ejemplos con casos de uso y justificación  
7. Buenas prácticas  

---

## 1. Principios de la arquitectura de componentes

La **arquitectura de componentes** busca **modularizar una aplicación** en bloques independientes, autónomos y reutilizables. Esta separación **reduce el acoplamiento** y mejora el mantenimiento.

### Principios fundamentales

- **Autonomía**: cada componente gestiona su lógica, datos y dependencias.
- **Reutilización**: componentes pueden usarse en múltiples contextos.
- **Aislamiento**: errores y cambios en un componente no afectan otros.
- **Contratos claros**: interacción por interfaces bien definidas (APIs).
- **Encapsulamiento**: el estado interno no se expone directamente.

---

## 2. Introducción a la arquitectura de microservicios

La arquitectura de microservicios es una evolución natural del enfoque por componentes, donde **cada componente se convierte en un servicio independiente**, que corre como un proceso autónomo y se comunica por red.

### Características clave

- Cada servicio implementa una **funcionalidad de negocio completa**.
- Tiene **su propia base de datos**, lógica y ciclo de vida.
- Desarrollado y desplegado por equipos independientes.
- Se comunican vía HTTP, gRPC o mensajería (Kafka, RabbitMQ, etc).

---

## 3. Comparación de arquitecturas

| Característica         | Monolito                  | Modular Monolith            | Microservicios                     |
|------------------------|---------------------------|------------------------------|------------------------------------|
| Base de datos          | Una única                 | Una única                   | Múltiples (una por servicio)       |
| Despliegue             | Una unidad                | Una unidad                  | Múltiples unidades                 |
| Comunicación interna   | Funcional directa         | Modular / in-process        | Vía red (HTTP, eventos, RPC)       |
| Independencia de equipos | Limitada                | Parcial                     | Alta                               |
| Escalabilidad          | Global                    | Parcial                     | Por servicio                       |
| Testing                | Simple                    | Controlado                  | Complejo                           |

---

## 4. Database-per-Service

Cada microservicio:

- Posee su **propia base de datos**.
- Es dueño de su modelo de datos.
- No comparte acceso directo con otros servicios.

Este principio mejora el aislamiento pero **rompe la capacidad de hacer JOINs tradicionales**. Para resolver relaciones, se debe recurrir a otros patrones.

---

## 5. Estrategias para relaciones entre entidades

### A) API Composition

> El servicio consulta directamente a otro por red (REST o gRPC) para obtener la relación.

#### Caso de uso: mostrar orden + datos del usuario

✅ Justificación: para visualización de datos actuales.  
⚠️ Riesgo: depende de la latencia/red.

---

### B) Event-Driven Aggregation

> Se replica parcialmente información de otro servicio mediante eventos.

#### Caso de uso: reporte de órdenes con nombre del usuario

✅ Justificación: consultas eficientes y resilientes.  
⚠️ Desventaja: datos desactualizados si no hay sincronización.

---

### C) Comunicación síncrona (NestJS Microservices)

> Usando `ClientProxy` con Kafka, Redis, o TCP para hacer llamadas remotas.

#### 📌 Caso de uso: validar existencia de usuario

✅ Justificación: validación inmediata sin acoplamiento de datos.  
⚠️ Riesgo: caída del servicio remoto detiene el flujo.

---

## 6. Casos de uso con su justificación

| Escenario                             | Estrategia recomendada         | Justificación                                       |
|--------------------------------------|--------------------------------|----------------------------------------------------|
| Mostrar orden con nombre del usuario | API Composition                | Datos frescos, lectura en tiempo real              |
| Generar reporte de órdenes por cliente | Event-Driven Aggregation       | Alta eficiencia, tolerancia a consistencia eventual |
| Validar existencia de un usuario     | Comunicación síncrona          | Operación puntual, no necesitas composición        |

---

## 7. Buenas prácticas

| Práctica                           | Beneficio                                 |
|------------------------------------|-------------------------------------------|
| Evitar JOIN entre servicios        | Aísla bases de datos y evita acoplamiento |
| Replicar solo lo necesario         | Mantiene eficiencia sin duplicar en exceso|
| Diseñar para fallos y latencia     | Servicios resilientes ante caídas         |
| Usar contratos bien definidos (DTO)| Minimiza errores entre servicios          |
