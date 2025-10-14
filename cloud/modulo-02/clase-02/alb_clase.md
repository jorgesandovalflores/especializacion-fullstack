# Módulo 2 · Sesión 3

## Application Load Balancer (ALB) en Profundidad

---

## Objetivos

1. Comprender el rol del **Application Load Balancer (ALB)** en la distribución del tráfico de capa 7.
2. Analizar su funcionamiento, arquitectura y componentes clave (listeners, rules, target groups).
3. Estudiar la integración con **ACM (SSL/TLS)**, **CloudWatch**, **WAF** y otros servicios de AWS.
4. Aplicar buenas prácticas para seguridad, escalabilidad y observabilidad en entornos productivos.

---

## Contenido de la clase

1. Introducción al ALB
2. Arquitectura y flujo del tráfico
3. Listeners, reglas y certificados SSL
4. Routing avanzado (host-based, path-based)
5. Integración con ACM y HTTPS
6. Políticas de seguridad TLS
7. Observabilidad y métricas
8. Buenas prácticas con ALB
9. Comparación con otros balanceadores
10. Ejemplo de arquitectura productiva
11. Ventajas clave del ALB

---

## Desarrollo del contenido

### 1. Introducción

El **Application Load Balancer (ALB)** pertenece a la familia de **Elastic Load Balancing (ELB)**.  
Su objetivo es **distribuir tráfico HTTP/HTTPS (capa 7)** entre instancias, contenedores o pods en una VPC.

Comparativa rápida:

-   **ALB** → capa 7 (HTTP/HTTPS).
-   **NLB** → capa 4 (TCP/UDP).
-   **CLB** → legado (capa 4/7).
-   **GLB** → capa 3 (firewalls o inspección).

ALB es ideal para **aplicaciones web, APIs REST y microservicios**.

---

### 2. Arquitectura y flujo

```
Internet
   │
   ▼
[ Application Load Balancer ]
   ├── Listener HTTP (80) → Redirección a HTTPS
   ├── Listener HTTPS (443) + Certificado SSL (ACM)
   │
   ├── Target Group: web-service (EC2/ECS/EKS)
   ├── Target Group: api-service (ECS)
   └── Health Checks
```

**Componentes principales:**

-   **Listeners:** definen cómo procesar el tráfico (puerto y protocolo).
-   **Rules:** reglas de ruteo basadas en host o path.
-   **Target Groups:** destino del tráfico.
-   **Health Checks:** validan la salud de las instancias.

---

### 3. Listeners y Certificados SSL

El listener HTTPS (puerto 443) gestiona tráfico cifrado con SSL/TLS.  
El certificado debe existir en ACM **en la misma región del ALB**.

Ejemplo de comandos:

```bash
aws acm request-certificate   --domain-name miapp.com   --subject-alternative-names "*.miapp.com"   --validation-method DNS   --region us-east-1
```

Asociar certificado al listener:

```bash
aws elbv2 create-listener   --load-balancer-arn <ALB_ARN>   --protocol HTTPS   --port 443   --certificates CertificateArn=<CERT_ARN>   --default-actions Type=forward,TargetGroupArn=<TG_ARN>
```

---

### 4. Routing avanzado

**Host-based routing:**

-   `api.miempresa.com` → target group `api-service`
-   `admin.miempresa.com` → target group `admin-panel`

**Path-based routing:**

-   `/api/*` → `api-service`
-   `/images/*` → `cdn-service`

```yaml
Rules:
    - Conditions:
          - Field: path-pattern
            Values:
                - /api/*
      Actions:
          - Type: forward
            TargetGroupArn: !Ref ApiTargetGroup
```

Permite segmentar microservicios y aplicaciones bajo un mismo dominio.

---

### 5. Integración con ACM y HTTPS

-   **ACM** gestiona emisión y renovación automática.
-   **ALB** usa **SNI (Server Name Indication)** para múltiples certificados.

| Dominio         | Certificado | Listener        |
| --------------- | ----------- | --------------- |
| `www.miapp.com` | ACM-ARN-1   | HTTPS:443       |
| `api.miapp.com` | ACM-ARN-2   | HTTPS:443 (SNI) |

---

### 6. Políticas de seguridad TLS

AWS ofrece políticas predefinidas que controlan versiones TLS y cipher suites.  
Ejemplo recomendado:

```
ELBSecurityPolicy-TLS13-1-2-2021-06
```

Configuración:

```bash
aws elbv2 modify-listener   --listener-arn <LISTENER_ARN>   --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06
```

---

### 7. Observabilidad y métricas

**Access Logs (S3):**  
Registra cada solicitud: IP origen, path, código HTTP, latencia, versión TLS.

**CloudWatch Metrics:**

-   `RequestCount`
-   `HTTPCode_ELB_4XX_Count`
-   `TargetResponseTime`

**Alarma ejemplo:**

> Notificar si `HTTPCode_ELB_5XX_Count > 50` durante 5 minutos.

**Integraciones extendidas:**  
Logs → S3 → Athena/Glue → Grafana.

---

### 8. Buenas prácticas

1. **Subnets en múltiples AZs** para alta disponibilidad.
2. Listener 80 redirigido a HTTPS (443).
3. Certificado ACM en misma región.
4. TLS 1.2 o superior.
5. Health checks dedicados (`/health`).
6. WAF delante del ALB.
7. Logs y métricas activas.
8. Auto Scaling detrás del ALB.
9. Reglas basadas en path/host para microservicios.
10. Monitoreo y alarmas de expiración SSL.

---

### 9. Comparación con otros balanceadores

| Tipo    | Capa | Casos de uso   | HTTPS | Latencia |
| ------- | ---- | -------------- | ----- | -------- |
| **ALB** | 7    | Web apps, APIs | ✅    | Media    |
| **NLB** | 4    | TCP, gRPC      | ✅    | Baja     |
| **CLB** | 4/7  | Legacy         | ✅    | Alta     |
| **GLB** | 3    | Firewalls      | ❌    | Variable |

---

### 10. Ejemplo de arquitectura productiva

```
[ Internet ]
     │
     ▼
┌────────────────────────┐
│ Application Load Balancer │
│ - Listener 80 → Redirect │
│ - Listener 443 (ACM SSL) │
└────────────┬────────────┘
             │
  ┌──────────┴───────────────┐
  │                          │
[Target Group 1]       [Target Group 2]
 Web (EC2/ECS)         API (ECS/EKS)
 /health               /api/status
```

Servicios integrados:

-   ACM (SSL)
-   CloudWatch (logs y métricas)
-   WAF (protección)
-   Route 53 (DNS)
-   Auto Scaling

---

### 11. Ventajas clave del ALB

-   Escalabilidad automática.
-   Routing inteligente (path, host, headers, query).
-   Compatibilidad con HTTP/2 y WebSockets.
-   Autenticación OIDC integrada.
-   Integración con WAF, ACM, CloudWatch, X-Ray.
-   Entry point unificado para microservicios.

---

## Conclusiones

El **Application Load Balancer (ALB)** es la pieza central del tráfico web moderno en AWS.  
Permite distribuir, asegurar y observar el tráfico HTTP/HTTPS con inteligencia y escalabilidad.  
Combinado con **ACM**, **WAF**, **CloudWatch** y **Auto Scaling**, conforma una capa de entrega robusta, segura y totalmente administrada.

```bash
## Crear el stack
aws cloudformation create-stack \
  --stack-name nestjs-usmp-api \
  --template-body file://template.yaml \
  --parameters \
      ParameterKey=KeyName,ParameterValue=pem-usmp \
      ParameterKey=DomainName,ParameterValue=usmp.identity.pe \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Ver el estado actual del stack
aws cloudformation describe-stacks --stack-name nestjs-usmp-api --region us-east-1

# Ver eventos detallados (recomendado)
ERT_ARN="arn:aws:acm:us-east-1:905418316214:certificate/88554266-080e-4814-a200-16c77144278e"
aws acm describe-certificate --certificate-arn $CERT_ARN --region us-east-1 --query 'Certificate.DomainValidationOptions[].ResourceRecord'
aws acm describe-certificate --certificate-arn $CERT_ARN --region us-east-1 --query 'Certificate.{Status:Status, Domain:DomainName, Validation:DomainValidationOptions}'

# Eliminar stack
aws cloudformation delete-stack --stack-name nestjs-usmp-api --region us-east-1
aws cloudformation describe-stacks --stack-name nestjs-usmp-api --region us-east-1

# Instalar app:
sudo yum update -y
sudo amazon-linux-extras enable docker
sudo yum clean metadata
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
sudo usermod -a -G docker ec2-user
newgrp docker
```
