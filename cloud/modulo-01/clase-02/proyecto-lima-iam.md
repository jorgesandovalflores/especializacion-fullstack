# Proyecto “Limon” – Gobierno de Accesos con AWS IAM

Aplicación de M2P para +100k comercios. Caso de uso completo de IAM con perfiles/roles por squad, políticas ejemplo, controles organizacionales y diagrama.

---

## 1) Contexto y cuentas

Para aislar riesgos y cumplir con PCI y buenas prácticas, se proponen múltiples cuentas de AWS bajo una organización:

- **Shared-Services**: SSO/IAM Identity Center, CodePipeline/CodeBuild compartidos, repos y artefactos.
- **Dev** y **Staging**: desarrollo e integración.
- **Prod-App**: aplicaciones expuestas (móvil, dashboard, admin).
- **Prod-Gateways**: **scope PCI** (gateways transaccionales, tokens, HSM/KMS).
- **Log&Audit**: CloudTrail org, Config, S3-Audit, SIEM.

**Mecanismos clave**:
- **AWS Organizations + SCPs** para restringir acciones no permitidas por cuenta.
- **IAM Identity Center (SSO)** con **Permission Sets** que asignan **IAM Roles** por cuenta.
- **Roles con asunción temporal (STS)** para operación humana y CI/CD (sin credenciales largas).
- **KMS**, **Secrets Manager**, **VPC Endpoints**, **PrivateLink** en Gateways (PCI).

---

## 2) Squads y productos

1. **Aplicación Mobile (Comercio)** – App Android/iOS para cobrar, ver ventas, etc.
2. **Administrador** – Backoffice interno (gestión de comercios, usuarios, catálogos, reglas).
3. **Dashboard Web (Comercio)** – Similar a móvil pero web.
4. **Gateways Transaccionales** – Motor de pago/tokens/settlement (PCI scope).

---

## 3) Perfiles (personas) y roles (IAM)

### 3.1 Perfiles transversales

- **Product Owner (PO)**: lectura amplia, sin escritura en recursos cloud.
- **DevOps/Platform**: IaC, redes, despliegues, monitoreo. Sin acceso a datos de tarjetas.
- **Security/Compliance**: acceso de solo lectura a auditoría y configuración; **break-glass** controlado.
- **Soporte N2/N3**: lectura de logs y métricas; acceso puntual a consolas de app (no producción de Gateways).
- **Data/BI**: acceso a datos **pseudonimizados** en lago de datos; nunca datos de PAN.

### 3.2 Perfiles por squad

- **Mobile Dev (App Móvil)**: acceso a repos/artefactos, S3 para assets, Parameter/Secrets (solo móviles), CloudWatch logs de su app; sin RDS en prod.
- **Web/Frontend Dev (Dashboard)**: S3/CloudFront del dashboard, API specs (API GW), logs propios.
- **Admin Backend Dev**: Lambda/ECS/Fargate del backoffice, RDS no-prod, lectura limitada en prod vía feature flags; no Gateways.
- **Gateways Backend Dev**: desarrollo solo en Dev/Staging; en Prod solo lectura de observabilidad. Despliegue a Prod vía pipeline con change control y aprobación Security/Compliance.

---

## 4) Mapeo a Roles IAM (por cuenta)

| Rol (ejemplo) | Cuenta | Uso | Permisos clave (alto nivel) |
|---|---|---|---|
| `Lima-MobileDev-DevRole` | Dev | Desarrollo móvil | S3 assets (rw), CloudWatch logs (rw), CodeArtifact (ro), Parameter/Secrets (scoped), API GW (ro), Lambda (deploy en Dev) |
| `Lima-DashboardDev-DevRole` | Dev | Front web | S3/CloudFront (rw dev), API GW (ro), Route53 dev (ro), WAF (ro) |
| `Lima-AdminDev-DevRole` | Dev | Backoffice | Lambda/ECS (rw dev), RDS dev (rw), SQS/SNS (rw dev) |
| `Lima-GWDev-DevRole` | Dev | Gateways | Lambda/ECS (rw dev), DynamoDB dev (rw), KMS dev (encrypt/decrypt scoped), sin acceso a secretos de prod |
| `Lima-DevOps-Shared` | Shared-Services | Plataforma | IAM (ro), CodePipeline/Build (rw), CloudFormation/Terraform (rw), networking (rw no-prod), sin KMS PCI prod |
| `Lima-SRE-ProdApp-ReadOnly` | Prod-App | Observabilidad | CloudWatch (ro), X-Ray (ro), ECS/EKS describe, ALB/NLB describe |
| `Lima-SRE-ProdGW-ReadOnly` | Prod-Gateways | Observabilidad | Solo observabilidad; sin secretos ni datos PCI |
| `Lima-AdminOps-ProdApp-Deploy` | Prod-App | Despliegue | Asumido por pipeline; CloudFormation deploy, ECS/EKS update, Lambda publish; sin `iam:*` |
| `Lima-AdminOps-ProdGW-Deploy` | Prod-Gateways | Despliegue | Igual al anterior pero gobernado por aprobación y límites SCP |
| `Lima-PO-Reader` | Todas | PO | `ReadOnlyAccess` (con excepciones SCP) |
| `Lima-Sec-Compliance-RO` | Log&Audit | Seguridad | S3 audit (ro), CloudTrail (ro), Config (ro), AccessAnalyzer (ro) |
| `Lima-BreakGlass` | Prod-Gateways | Emergencia | Role con sesión corta, MFA, aprobación, session tagging; CloudTrail+GuardDuty monitor, solo uso en incidentes |

**Nota:** Todos los roles exigen MFA (via SSO), duración de sesión corta, session tags (squad, ticket) y están restringidos por permission boundaries y SCPs.

---

## 5) Controles Organizacionales (SCPs) clave

- **Bloqueo global en Prod-Gateways**:
  - Denegar `iam:*` (crear/modificar roles/policies).
  - Denegar `kms:*` salvo ARNs explícitos vía condition.
  - Denegar `s3:*` fuera de buckets PCI whitelisted.
  - Denegar acciones de consola peligrosas sin `aws:MultiFactorAuthPresent = true`.
- **Solo despliegue vía Pipeline**: permitir `cloudformation:*` y `codedeploy:*` solo a roles de CI/CD con `aws:PrincipalTag = Pipeline=true`.

---

## 6) Ejemplos de Políticas (resumidas)

### 6.1 Permission Boundary – Dev roles (evita elevar privilegios)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "DenyIAMAdmin",
      "Effect": "Deny",
      "Action": ["iam:*","organizations:*"],
      "Resource": "*"
    },
    { "Sid": "AllowScopedDev",
      "Effect": "Allow",
      "Action": [
        "lambda:*","logs:*","cloudwatch:*","s3:*","dynamodb:*","apigateway:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": { "aws:RequestedRegion": ["us-east-1"] }
      }
    }
  ]
}
```

### 6.2 Rol de pipeline para desplegar a Prod-App (solo CloudFormation/Code*)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow",
      "Action": ["cloudformation:*","codedeploy:*","ecs:*","lambda:*","iam:PassRole"],
      "Resource": "*",
      "Condition": { "StringEquals": { "aws:PrincipalTag/Pipeline": "true" } }
    },
    { "Effect": "Deny", "Action": ["kms:CreateKey","kms:ScheduleKeyDeletion"], "Resource": "*" }
  ]
}
```

### 6.3 Observabilidad de Prod-Gateways (solo lectura estricta)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect":"Allow", "Action":["cloudwatch:Get*","cloudwatch:List*","logs:Get*","logs:Describe*","xray:Get*","xray:BatchGet*"], "Resource":"*" },
    { "Effect":"Deny", "Action":["secretsmanager:GetSecretValue","kms:Decrypt"], "Resource":"*" }
  ]
}
```

### 6.4 Acceso App Móvil a assets (S3) y logs
```json
{
  "Version":"2012-10-17",
  "Statement":[
    { "Effect":"Allow", "Action":["s3:GetObject","s3:ListBucket"], "Resource":["arn:aws:s3:::lima-mobile-assets","arn:aws:s3:::lima-mobile-assets/*"] },
    { "Effect":"Allow", "Action":["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"], "Resource":"*" }
  ]
}
```

### 6.5 Trust policy para roles asumidos vía SSO (IAM Identity Center)
```json
{
  "Version":"2012-10-17",
  "Statement":[
    { "Effect":"Allow",
      "Principal": { "AWS": "arn:aws:iam::<ID-SSO-Account>:role/AWSReservedSSO_..." },
      "Action":"sts:AssumeRole",
      "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }
    }
  ]
}
```

---

## 7) Flujo de despliegue y operación (alto nivel)

- Devs trabajan en Dev/Staging con roles de desarrollo.
- CI/CD en Shared-Services asume `Lima-AdminOps-ProdApp-Deploy` o `Lima-AdminOps-ProdGW-Deploy` tras aprobaciones (Change Advisory + Security).
- En Prod-Gateways, ningún humano escribe, salvo **break-glass** (MFA, tiempo limitado, justificación y session tags).
- Seguridad y Compliance tienen solo lectura a auditoría central (Log&Audit).

---

**Lectura del diagrama**
- El acceso humano y de pipelines ocurre asumiendo roles entre cuentas.
- **Prod-Gateways (PCI)** tiene el cerco más estricto: despliegues solo por pipeline, humanos solo observan.
- **Log&Audit** centraliza auditoría desde todas las cuentas.

---

## 9) Controles adicionales recomendados

- **Session tags obligatorias**: `squad`, `changeId`, `ticket`.
- **CloudTrail + GuardDuty + Detective** habilitados org-wide.
- **Access Analyzer** para detectar recursos públicos o compartidos indebidos.
- **Config Rules** y **Conformance Packs** (PCI/WAF/Bucket encryption).
- **KMS key policies** mínimas y rotación anual; uso de HSM si aplica.
- **Secrets Manager** con rotación automática; nunca secretos en variables de entorno planas.
- **WAF** delante de APIs públicas y mTLS donde sea posible.

---

## 10) Checklists por perfil (extracto)

**Mobile/Web Dev**
- [ ] No acceso a RDS/Dynamo prod.
- [ ] S3 assets ro/rw por entorno.
- [ ] Logs y métricas de su app.

**Admin Dev**
- [ ] Backoffice en Dev/Staging rw.
- [ ] Prod: solo despliegues por pipeline.
- [ ] Sin KMS/Secrets de Gateways.

**Gateways Dev**
- [ ] Dev/Staging rw controlado.
- [ ] Prod: observabilidad read-only.
- [ ] Sin secretos/datos de PAN.

**DevOps**
- [ ] IaC y redes por entorno, sin llaves PCI.
- [ ] PassRole limitado a roles de servicio.
- [ ] Cambios en prod vía pipeline.

**Security/Compliance**
- [ ] RO a auditoría.
- [ ] Break-glass con MFA y justificación.
- [ ] Monitoreo de actividades anómalas.
