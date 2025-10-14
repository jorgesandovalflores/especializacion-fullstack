# Módulo 2 · Sesión 2

## Gestión de Seguridad con Certificados SSL

---

## Objetivos

1. Comprender el propósito y funcionamiento de los certificados SSL/TLS en la seguridad web.
2. Aprender a **emitir, validar y gestionar certificados SSL** mediante **AWS Certificate Manager (ACM)**.
3. Integrar certificados SSL con **servicios como CloudFront, Load Balancer y API Gateway**.
4. Aplicar **buenas prácticas** para asegurar comunicaciones seguras en entornos productivos.

---

## Contenido de la clase

1. Introducción a AWS Certificate Manager (ACM)
2. Emisión y Validación de Certificados SSL
3. Integración con Servicios de AWS
4. Buenas Prácticas para Seguridad Web
5. Ejemplo Práctico: ACM + Application Load Balancer
6. Conclusiones

---

## Desarrollo del contenido

### 1. Introducción a AWS Certificate Manager (ACM)

#### 1.1. ¿Qué es un certificado SSL/TLS?

Un **certificado SSL (Secure Sockets Layer)**, actualmente basado en **TLS (Transport Layer Security)**, cifra la comunicación entre un cliente (navegador, app, API) y un servidor web, garantizando:

-   **Confidencialidad:** los datos viajan cifrados.
-   **Integridad:** la información no puede ser alterada.
-   **Autenticidad:** el dominio pertenece a quien dice ser.

Ejemplo de conexión segura:

```
https://mi-sitio.com  ✅  (candado verde)
```

El navegador verifica que el certificado fue emitido por una **autoridad certificadora (CA)** de confianza y que el dominio es válido.

---

#### 1.2. AWS Certificate Manager (ACM)

**AWS Certificate Manager (ACM)** simplifica la administración de certificados SSL/TLS para tus aplicaciones dentro del ecosistema AWS.

**Características principales:**

-   Emite **certificados públicos gratuitos** (para dominios validados).
-   Permite **importar certificados externos** (por ejemplo, de Let's Encrypt o DigiCert).
-   Renueva certificados automáticamente.
-   Se integra fácilmente con servicios de AWS como:
    -   **Elastic Load Balancer (ALB/NLB)**
    -   **CloudFront**
    -   **API Gateway**
    -   **Elastic Beanstalk**

---

### 2. Emisión y Validación de Certificados SSL

#### 2.1. Tipos de certificados en ACM

| Tipo de Certificado | Propósito                                                        | Ejemplo                     |
| ------------------- | ---------------------------------------------------------------- | --------------------------- |
| **Público**         | Emitido por AWS y reconocido por navegadores.                    | `www.miempresa.com`         |
| **Privado**         | Emitido dentro de una **Private CA** para redes internas o VPNs. | `api.local.miempresa.com`   |
| **Importado**       | Emitido externamente y cargado manualmente.                      | `letsencrypt.miempresa.com` |

---

#### 2.2. Solicitud de certificado público

Pasos en la consola de **AWS Certificate Manager (ACM)**:

1. En la consola, selecciona **Request a certificate**.
2. Elige **Request a public certificate**.
3. Agrega los nombres de dominio (por ejemplo:  
   `miempresa.com` y `*.miempresa.com` para wildcard).
4. Selecciona el método de validación:
    - **DNS validation (recomendado)**: crea automáticamente un registro CNAME en Route 53.
    - **Email validation**: requiere aprobación manual por correo.
5. Espera la validación (puede tardar unos minutos).
6. Una vez emitido, el certificado aparece con estado **"Issued"**.

---

#### 2.3. Validación DNS (recomendada)

-   ACM genera un **registro CNAME** con un nombre y valor únicos.
-   Si tu dominio está en **Route 53**, ACM puede agregarlo automáticamente.
-   Una vez validado, AWS renueva el certificado de forma automática sin intervención manual.

Ejemplo de registro DNS:

| Nombre                  | Tipo  | Valor                          |
| ----------------------- | ----- | ------------------------------ |
| `_ab1234.miempresa.com` | CNAME | `_xyz987.acm-validations.aws.` |

---

### 3. Integración con Servicios de AWS

#### 3.1. Con CloudFront

1. Ve a tu distribución en CloudFront.
2. En el campo **Alternate Domain Names (CNAMEs)** agrega tu dominio (`www.miempresa.com`).
3. En **Custom SSL Certificate**, selecciona el certificado emitido por ACM.
4. Guarda los cambios y espera la propagación (~15-30 minutos).

Ahora tu contenido se servirá con **HTTPS** y **TLS 1.2/1.3**.

---

#### 3.2. Con Application Load Balancer (ALB)

1. En la consola de **EC2 → Load Balancers**, selecciona tu ALB.
2. Edita o crea un **Listener HTTPS (443)**.
3. Selecciona el certificado emitido en ACM.
4. Configura la redirección del puerto **80 → 443** para forzar HTTPS.

---

#### 3.3. Con API Gateway

1. En **Custom Domain Names**, registra tu dominio (`api.miempresa.com`).
2. Asocia el certificado SSL emitido por ACM.
3. Mapea la API deseada con un **Base Path Mapping**.
4. Configura **Route 53** para apuntar al dominio de API Gateway.

---

### 4. Buenas Prácticas para Seguridad Web

1. **Usa validación DNS**: evita dependencias humanas y facilita la renovación automática.
2. **Forza HTTPS en toda la aplicación**: redirige tráfico HTTP → HTTPS.
3. **Mantén TLS actualizado**: usa versiones 1.2 o 1.3, desactiva 1.0/1.1.
4. **Renovación automática**: ACM lo hace por ti, pero revisa logs de CloudWatch.
5. **Política de Seguridad de Transporte Estricto (HSTS)**:  
   agrega cabecera HTTP:
    ```
    Strict-Transport-Security: max-age=31536000; includeSubDomains
    ```
6. **Protege subdominios internos**: usa certificados privados de ACM Private CA.
7. **No compartas claves privadas**: restringe accesos IAM y rotación periódica.

---

### 5. Ejemplo Práctico: ACM + Application Load Balancer

**Escenario:**  
Implementar un **sitio web con balanceo de carga** que sirva contenido desde **EC2 detrás de un Application Load Balancer**, protegido por **HTTPS con un certificado emitido por ACM**.

#### Flujo general:

1. ACM emite un certificado para `demo.miempresa.com`.
2. Se crea un ALB público con listeners 80 y 443.
3. El listener 443 usa el certificado ACM.
4. Se redirige automáticamente HTTP → HTTPS.
5. El tráfico se distribuye entre instancias EC2 del grupo.

---

#### CloudFormation: `alb-acm-demo.yml`

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "Ejemplo práctico - ALB con certificado SSL de ACM"

Parameters:
    DomainName:
        Type: String
        Description: Dominio validado en ACM (ej. demo.miempresa.com)
    CertificateArn:
        Type: String
        Description: ARN del certificado emitido por ACM

Resources:
    WebSecurityGroup:
        Type: AWS::EC2::SecurityGroup
        Properties:
            GroupDescription: Permitir HTTP y HTTPS
            VpcId: !Ref AWS::NoValue
            SecurityGroupIngress:
                - IpProtocol: tcp
                  FromPort: 80
                  ToPort: 80
                  CidrIp: 0.0.0.0/0
                - IpProtocol: tcp
                  FromPort: 443
                  ToPort: 443
                  CidrIp: 0.0.0.0/0

    WebInstance:
        Type: AWS::EC2::Instance
        Properties:
            ImageId: ami-0c55b159cbfafe1f0
            InstanceType: t3.micro
            SecurityGroupIds: [!Ref WebSecurityGroup]
            UserData:
                Fn::Base64: |
                    #!/bin/bash
                    yum update -y
                    yum install -y httpd
                    echo "<h1>Demo HTTPS con ACM + ALB</h1>" > /var/www/html/index.html
                    systemctl start httpd
                    systemctl enable httpd

    TargetGroup:
        Type: AWS::ElasticLoadBalancingV2::TargetGroup
        Properties:
            Port: 80
            Protocol: HTTP
            VpcId: !Ref AWS::NoValue
            TargetType: instance
            Targets:
                - Id: !Ref WebInstance

    ApplicationLoadBalancer:
        Type: AWS::ElasticLoadBalancingV2::LoadBalancer
        Properties:
            Name: alb-acm-demo
            Scheme: internet-facing
            Subnets: !Ref AWS::NoValue
            SecurityGroups: [!Ref WebSecurityGroup]

    ListenerHTTP:
        Type: AWS::ElasticLoadBalancingV2::Listener
        Properties:
            LoadBalancerArn: !Ref ApplicationLoadBalancer
            Port: 80
            Protocol: HTTP
            DefaultActions:
                - Type: redirect
                  RedirectConfig:
                      Protocol: HTTPS
                      Port: "443"
                      StatusCode: HTTP_301

    ListenerHTTPS:
        Type: AWS::ElasticLoadBalancingV2::Listener
        Properties:
            LoadBalancerArn: !Ref ApplicationLoadBalancer
            Port: 443
            Protocol: HTTPS
            Certificates:
                - CertificateArn: !Ref CertificateArn
            DefaultActions:
                - Type: forward
                  TargetGroupArn: !Ref TargetGroup

Outputs:
    LoadBalancerDNSName:
        Description: URL pública del ALB con HTTPS
        Value: !GetAtt ApplicationLoadBalancer.DNSName
```

**Resultado:**  
Un balanceador de carga con HTTPS activo mediante un certificado válido de ACM, redirigiendo todo el tráfico HTTP → HTTPS automáticamente.

---

### 6. Conclusiones

-   AWS ACM simplifica enormemente la gestión de certificados SSL.
-   La validación DNS permite renovaciones automáticas sin intervención humana.
-   La integración con CloudFront, ALB y API Gateway ofrece cifrado extremo a extremo.
-   Aplicar buenas prácticas SSL garantiza confianza y cumplimiento con normativas de seguridad modernas.
