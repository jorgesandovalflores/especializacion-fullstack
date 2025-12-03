# Elegir e implementar estrategias de Disaster Recovery (DR) según el RTO y RPO requeridos

## 1. Recordatorio rápido: RTO y RPO

### RTO (Recovery Time Objective)
Es el **tiempo máximo aceptable** que un servicio puede estar caído antes de ser recuperado.  
Ejemplo: “Si el backend de pagos cae, debe volver a estar operativo en máximo 1 hora.”

### RPO (Recovery Point Objective)
Es la **cantidad máxima de datos que puedo perder**, medida en tiempo.  
Ejemplo: “En caso de desastre, acepto perder como máximo 15 minutos de datos.”

Piensa así:
- **RTO = cuánto tiempo puede estar apagado el sistema.**
- **RPO = cuántos datos puedo perder.**

---

## 2. Tipos de estrategias de DR y su relación con RTO/RPO

| Estrategia | RTO típico | RPO típico | Complejidad / Costo |
|------------|------------|------------|---------------------|
| **Backup & Restore** | Horas / días | Horas / 24h | Bajo |
| **Pilot Light** | Decenas de minutos | Minutos / 1h | Medio |
| **Warm Standby** | Minutos | Minutos | Medio–Alto |
| **Multi-site Active/Active** | Segundos / casi 0 | Segundos / casi 0 | Alto |

Lógica:
- RTO/RPO *altos* → Backup & Restore.  
- RTO/RPO *medios* → Pilot Light / Warm Standby.  
- RTO/RPO *muy agresivos* → Active/Active.

---

## 3. Pasos para elegir la estrategia según RTO/RPO

### Paso 1: Clasificar cargas de trabajo
- Críticos: pagos, pedidos.
- Importantes: panel admin, reportes.
- De apoyo: BI, informes.

### Paso 2: Definir RTO y RPO numéricos
Ejemplos:
- Pedidos: **RTO 30 min, RPO 5 min**  
- Reportes: **RTO 24h, RPO 12h**

### Paso 3: Colocar cada sistema en la matriz
- Pedidos → Warm Standby o Pilot Light reforzado.  
- Reportes → Backup & Restore.

### Paso 4: Elegir la estrategia
Según la matriz, criticidad y presupuesto.

### Paso 5: Validar costo vs riesgo
A veces bajar exigencia de RTO/RPO reduce fuertemente el costo.

---

## 4. Cómo implementar cada estrategia en AWS

### 4.1 Backup & Restore
Usas solo backups y reconstruyes infraestructura al ocurrir el desastre.

**Servicios:**
- AWS Backup  
- RDS snapshots  
- EBS snapshots  
- S3 versionado  
- CloudFormation / CDK / Terraform

**Flujo:**
1. Detectas el desastre.  
2. Levantas infraestructura en región DR.  
3. Restauras base de datos y volúmenes.  
4. Route 53 apunta al entorno nuevo.

**Ideal cuando:** Se tolera tiempo de caída alto y pérdida de datos moderada.

---

### 4.2 Pilot Light
Mantienes una versión mínima siempre encendida en la región DR.

**Componentes:**
- Réplica RDS cross-region  
- DynamoDB Global Tables  
- S3 replication  
- ECS/EKS mínimamente levantado (capacidad 0 o 1)

**Flujo:**
1. Promueves la réplica de la base de datos.  
2. Escalas compute a tamaño productivo.  
3. Cambias DNS con Route 53.

**Ideal cuando:** Se requiere recuperación relativamente rápida.

---

### 4.3 Warm Standby
La región de DR ya tiene toda la arquitectura desplegada, pero a capacidad reducida.

**Componentes:**
- Aurora Global Database o RDS cross-region  
- ECS/EKS desplegado pero con pocas réplicas  
- Route 53 Failover  
- S3 CRR

**Flujo:**
1. Se incrementa capacidad.  
2. Se promueve la base de datos.  
3. Route 53 activa DR.

**Ideal cuando:** No toleras más de unos minutos de caída.

---

### 4.4 Active/Active Multi-site
Ambas regiones sirven tráfico en simultáneo.

**Componentes:**
- Aurora Global Database / DynamoDB Global Tables  
- Route 53 Latency-Based / Weighted  
- S3 replicación multidireccional  
- ECS/EKS desplegado en ambas regiones

**Flujo:**
1. Una región cae.  
2. La otra sigue activa sin interrupciones mayores.

**Ideal cuando:** RTO/RPO casi cero.

---

## 5. Ejemplos prácticos

### Ejemplo 1: Portal de reportes
- RTO: 24h  
- RPO: 12h  
→ **Backup & Restore**

### Ejemplo 2: App de taxi (viajes)
- RTO: 30 min  
- RPO: 5 min  
→ **Warm Standby**

### Ejemplo 3: Sistema de autenticación
- RTO: 5 min  
- RPO: 1 min  
→ **Active/Active**

---

## 6. Buenas prácticas para implementar DR
- Definir RTO/RPO por servicio, no a nivel global.  
- Documentar runbooks de failover/fallback.  
- Automatizar todo con IaC.  
- Hacer simulacros frecuentes de DR.  
- Monitorear replicación (lag de réplicas).  
- Revisar RTO/RPO periódicamente.

---

## 7. Conclusión
La clave está en **alinear RTO/RPO del negocio** con la **estrategia técnica de DR** más adecuada. AWS permite cubrir desde un DR básico y económico hasta arquitecturas globales Active/Active para cero downtime.
