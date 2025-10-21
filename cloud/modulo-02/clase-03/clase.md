# Módulo 2 · Sesión 3

## Almacenamiento con Amazon S3 (con CloudFormation + EC2)

---

## Objetivos

1. Profundizar en **Amazon S3**: arquitectura, garantías, rendimiento y gobierno de datos.
2. Diseñar buckets con **seguridad por defecto**: BPA, cifrado, versionado, políticas y CORS.
3. Integrar S3 con cómputo usando **VPC Endpoints** para tráfico privado.
4. Desplegar **por IaC (CloudFormation)** un stack que incluye: **VPC**, **Endpoint S3**, **Bucket**, **IAM Role** y **EC2**.
5. Implementar un **backend NestJS** que sube archivos a S3 y entrega **URLs prefirmadas**.

---

## Contenido de la clase

1. Fundamentos y arquitectura de Amazon S3.
2. Clases de almacenamiento y optimización de costos.
3. Seguridad: BPA, cifrado, políticas, KMS, Object Lock, CORS.
4. Versionado, replicación, ciclo de vida y herramientas (Storage Lens, Inventory).
5. Integración con cómputo y redes: IAM Roles, **VPC Gateway Endpoint** para S3.
6. **Laboratorio**: CloudFormation que crea VPC + Endpoint S3 + Bucket + EC2, y backend **NestJS** para subir archivos.
7. Checklist de producción y troubleshooting.

---

## Desarrollo del contenido

### 1) Fundamentos de Amazon S3

**Modelo de objetos.** S3 almacena objetos `{key, bytes, metadatos, versión}` en **buckets** por **región**. Las claves simulan directorios por prefijos (`fotos/2025/img.png`).

**Durabilidad y disponibilidad.** S3 Standard ofrece 99.999999999% de **durabilidad** (replicación interna multi-AZ) y **alta disponibilidad** para lecturas y escrituras. **Consistencia fuerte** para PUT/DELETE/GET/LIST.

**Direcciones y acceso.**

-   Estilo virtual-host: `https://<bucket>.s3.<region>.amazonaws.com/<key>`.
-   Hosting estático con endpoint de sitio web cuando el bucket es público (no es nuestro caso).

**Rendimiento y límites.**

-   Tamaño máx. 5 TB/objeto. **Multipart Upload** (10k partes) para >100 MB.
-   Paralelizar por prefijos. Usar `@aws-sdk/lib-storage` para subir en partes.
-   **Eventos**: disparar SQS/SNS/Lambda al crear/borrar objetos.
-   **S3 Select**, **Object Lambda**, **Storage Lens** e **Inventory** para analítica y gobierno.

### 2) Clases de almacenamiento y costos

-   **Standard**: acceso frecuente.
-   **Intelligent-Tiering**: mueve automáticamente entre niveles (cargo por objeto).
-   **Standard-IA / One Zone-IA**: esporádico (tarifa por recuperación).
-   **Glacier (Instant / Flexible / Deep)**: archivo a largo plazo.
-   **S3 Express One Zone**: latencia muy baja en 1 AZ (casos especiales).
    **Ahorro**: Lifecycle → transición a IA/Glacier, expiración de versiones, compresión, formatos columnares (Parquet), presigned GET para evitar copias innecesarias.

### 3) Seguridad y gobierno

-   **BPA (Block Public Access)** activado a nivel cuenta y bucket.
-   **ACLs deshabilitadas**; usar **IAM Roles + Bucket Policy**.
-   **Cifrado** en reposo: **SSE-S3** (simple) o **SSE-KMS** (control granular).
-   **Cifrado en tránsito**: TLS siempre.
-   **Object Lock (WORM)** y **MFA Delete** con versionado.
-   **Acceso privado** desde workloads en VPC con **Gateway VPC Endpoint** para S3 (evita Internet/NAT).
-   **Restricción por origen** en la Bucket Policy usando `aws:SourceVpce` y/o `aws:PrincipalArn`.
-   **CORS** mínimo indispensable para subir desde navegador.
-   **Etiquetado** y **Logging** para auditoría y costos.

### 4) Versionado, replicación y ciclo de vida

-   **Versioning** protege contra borrados accidentales.
-   **Replication** (CRR/SRR) para DR/compliance.
-   **Lifecycle** para transiciones y expiraciones (incluye versiones no actuales).

### 5) Integración con cómputo y redes

-   **Roles de IAM** (EC2/ECS/EKS/Lambda) con permisos mínimos al bucket.
-   **VPC Endpoint S3 (Gateway)**: rutas privadas a S3, menos costo y mejor postura de seguridad.
-   Patrones de subida: backend como proxy vs **URL/POST prefirmado** para subida directa.
-   **CORS** cuando el navegador sube a S3.

### 6) CORS recomendado (base)

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://tu-dominio.com"
        ],
        "ExposeHeaders": ["ETag", "x-amz-request-id", "x-amz-id-2"],
        "MaxAgeSeconds": 3000
    }
]
```

Ajustar orígenes/métodos a lo mínimo.

---

## Laboratorio: CloudFormation (S3 + EC2 en VPC con Endpoint S3) + API NestJS

### Arquitectura del laboratorio

-   **VPC** con 2 subredes públicas (para simplicidad del taller).
-   **Internet Gateway** + rutas (permitir actualizaciones y acceso de administración).
-   **Gateway VPC Endpoint** para **S3**: acceso **privado** a S3 desde la VPC.
-   **S3 Bucket**: BPA, cifrado SSE-S3, versionado, CORS, Lifecycle opcional.
-   **IAM Role** + **Instance Profile** para EC2 con permisos **mínimos** al bucket.
-   **EC2 Amazon Linux 2023** (t3.micro predeterminado) con **UserData** que instala Node.js 22 y Git.  
    La instancia podrá subir/leer objetos del bucket a través del **Endpoint S3**.

> Nota: Mantendremos **SSH** abierto por parámetro (restringe a tu IP). En producción, prefiere **SSM Session Manager**.

### Parámetros sugeridos

-   `AllowedSSH`: tu IP con `/32` (ej. `1.2.3.4/32`).
-   `BucketName`: nombre global único (o se generará uno con sufijo).
-   `KeyPairName`: par de llaves EC2 existente.
-   `VpcCidr`: `10.0.0.0/16` (por defecto).

### Template CloudFormation (`s3-ec2-vpcendpoint.yaml`)

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: "VPC + S3 Gateway Endpoint + S3 Bucket (BPA, SSE, Versioning, CORS) + EC2 con Role para acceso privado a S3"

Parameters:
    VpcCidr:
        Type: String
        Default: 10.0.0.0/16
        Description: CIDR para la VPC
    PublicSubnet1Cidr:
        Type: String
        Default: 10.0.1.0/24
    PublicSubnet2Cidr:
        Type: String
        Default: 10.0.2.0/24
    AllowedSSH:
        Type: String
        Default: 0.0.0.0/0
        Description: CIDR para SSH (restringe a tu IP en producción)
    KeyPairName:
        Type: AWS::EC2::KeyPair::KeyName
        Description: Nombre del KeyPair para la EC2
    BucketName:
        Type: String
        Default: ""
        Description: (Opcional) Nombre del bucket. Si vacío, se genera con el ID del stack.
    AllowedOrigins:
        Type: CommaDelimitedList
        Default: "http://localhost:3000,http://localhost:5173"
        Description: Orígenes permitidos para CORS
    InstanceType:
        Type: String
        Default: t3.micro
        AllowedValues:
            - t3.micro
            - t3.small
            - t3.medium
            - t4g.micro
            - t4g.small
            - t4g.medium
        Description: Tipo de instancia

Mappings:
    RegionMap:
        us-east-1:
            AL2023: "ami-0b72821e2f351e396"
        us-east-2:
            AL2023: "ami-0a4121235da23f3aa"
        us-west-2:
            AL2023: "ami-013168dc3850ef002"

Conditions:
    HasBucketName: !Not [!Equals [!Ref BucketName, ""]]

Resources:
    VPC:
        Type: AWS::EC2::VPC
        Properties:
            CidrBlock: !Ref VpcCidr
            EnableDnsHostnames: true
            EnableDnsSupport: true
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-vpc" }]

    IGW:
        Type: AWS::EC2::InternetGateway
    VPCGatewayAttachment:
        Type: AWS::EC2::VPCGatewayAttachment
        Properties:
            InternetGatewayId: !Ref IGW
            VpcId: !Ref VPC

    PublicSubnet1:
        Type: AWS::EC2::Subnet
        Properties:
            VpcId: !Ref VPC
            CidrBlock: !Ref PublicSubnet1Cidr
            MapPublicIpOnLaunch: true
            AvailabilityZone: !Select [0, !GetAZs ""]
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-public-1" }]

    PublicSubnet2:
        Type: AWS::EC2::Subnet
        Properties:
            VpcId: !Ref VPC
            CidrBlock: !Ref PublicSubnet2Cidr
            MapPublicIpOnLaunch: true
            AvailabilityZone: !Select [1, !GetAZs ""]
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-public-2" }]

    PublicRouteTable:
        Type: AWS::EC2::RouteTable
        Properties:
            VpcId: !Ref VPC
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-public-rt" }]

    PublicRoute:
        Type: AWS::EC2::Route
        Properties:
            RouteTableId: !Ref PublicRouteTable
            DestinationCidrBlock: 0.0.0.0/0
            GatewayId: !Ref IGW

    PublicSubnet1RouteTableAssociation:
        Type: AWS::EC2::SubnetRouteTableAssociation
        Properties:
            SubnetId: !Ref PublicSubnet1
            RouteTableId: !Ref PublicRouteTable

    PublicSubnet2RouteTableAssociation:
        Type: AWS::EC2::SubnetRouteTableAssociation
        Properties:
            SubnetId: !Ref PublicSubnet2
            RouteTableId: !Ref PublicRouteTable

    # Gateway Endpoint para S3 (rutas privadas a S3)
    S3GatewayEndpoint:
        Type: AWS::EC2::VPCEndpoint
        Properties:
            VpcId: !Ref VPC
            ServiceName: !Sub "com.amazonaws.${AWS::Region}.s3"
            RouteTableIds: [!Ref PublicRouteTable]
            VpcEndpointType: Gateway
            PolicyDocument:
                Version: "2012-10-17"
                Statement:
                    - Sid: AllowListAndGet
                      Effect: Allow
                      Principal: "*"
                      Action: ["s3:*"]
                      Resource: ["*"]

    S3Bucket:
        Type: AWS::S3::Bucket
        Properties:
            BucketName:
                !If [
                    HasBucketName,
                    !Ref BucketName,
                    !Sub "${AWS::StackName}-${AWS::AccountId}-${AWS::Region}",
                ]
            PublicAccessBlockConfiguration:
                BlockPublicAcls: true
                IgnorePublicAcls: true
                BlockPublicPolicy: true
                RestrictPublicBuckets: true
            VersioningConfiguration:
                Status: Enabled
            BucketEncryption:
                ServerSideEncryptionConfiguration:
                    - ServerSideEncryptionByDefault:
                          SSEAlgorithm: AES256
            CorsConfiguration:
                CorsRules:
                    - AllowedHeaders: ["*"]
                      AllowedMethods: ["GET", "PUT", "POST"]
                      AllowedOrigins: !Ref AllowedOrigins
                      ExposedHeaders: ["ETag", "x-amz-request-id", "x-amz-id-2"]
                      MaxAge: 3000
            LifecycleConfiguration:
                Rules:
                    - Id: TransitionToIA
                      Status: Enabled
                      Transitions:
                          - StorageClass: STANDARD_IA
                            TransitionInDays: 30
        DeletionPolicy: Retain

    # Bucket policy: acceso solo vía este VPCE y por el rol de la instancia
    S3BucketPolicy:
        Type: AWS::S3::BucketPolicy
        Properties:
            Bucket: !Ref S3Bucket
            PolicyDocument:
                Version: "2012-10-17"
                Statement:
                    - Sid: DenyNonVPCE
                      Effect: Deny
                      Principal: "*"
                      Action: "s3:*"
                      Resource:
                          - !Sub "arn:aws:s3:::${S3Bucket}"
                          - !Sub "arn:aws:s3:::${S3Bucket}/*"
                      Condition:
                          StringNotEquals:
                              aws:SourceVpce: !Ref S3GatewayEndpoint
                    - Sid: AllowEC2RoleOnPrefix
                      Effect: Allow
                      Principal:
                          AWS: !GetAtt Ec2Role.Arn
                      Action:
                          - "s3:ListBucket"
                      Resource: !Sub "arn:aws:s3:::${S3Bucket}"
                    - Sid: AllowObjectLevel
                      Effect: Allow
                      Principal:
                          AWS: !GetAtt Ec2Role.Arn
                      Action:
                          - "s3:PutObject"
                          - "s3:GetObject"
                          - "s3:DeleteObject"
                          - "s3:PutObjectTagging"
                      Resource: !Sub "arn:aws:s3:::${S3Bucket}/uploads/*"

    Ec2SecurityGroup:
        Type: AWS::EC2::SecurityGroup
        Properties:
            GroupDescription: Permitir SSH y HTTP
            VpcId: !Ref VPC
            SecurityGroupIngress:
                - IpProtocol: tcp
                  FromPort: 22
                  ToPort: 22
                  CidrIp: !Ref AllowedSSH
                - IpProtocol: tcp
                  FromPort: 3000
                  ToPort: 3000
                  CidrIp: 0.0.0.0/0
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-sg" }]

    Ec2Role:
        Type: AWS::IAM::Role
        Properties:
            AssumeRolePolicyDocument:
                Version: "2012-10-17"
                Statement:
                    - Effect: Allow
                      Principal:
                          Service: [ec2.amazonaws.com]
                      Action: ["sts:AssumeRole"]
            Path: "/"
            Policies:
                - PolicyName: S3BucketLimitedAccess
                  PolicyDocument:
                      Version: "2012-10-17"
                      Statement:
                          - Effect: Allow
                            Action:
                                - "s3:ListBucket"
                            Resource: !Sub "arn:aws:s3:::${S3Bucket}"
                          - Effect: Allow
                            Action:
                                - "s3:PutObject"
                                - "s3:GetObject"
                                - "s3:DeleteObject"
                                - "s3:PutObjectTagging"
                            Resource: !Sub "arn:aws:s3:::${S3Bucket}/uploads/*"
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-role" }]

    Ec2InstanceProfile:
        Type: AWS::IAM::InstanceProfile
        Properties:
            Path: "/"
            Roles: [!Ref Ec2Role]

    Ec2Instance:
        Type: AWS::EC2::Instance
        Properties:
            ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", AL2023]
            InstanceType: !Ref InstanceType
            IamInstanceProfile: !Ref Ec2InstanceProfile
            KeyName: !Ref KeyPairName
            SubnetId: !Ref PublicSubnet1
            SecurityGroupIds: [!Ref Ec2SecurityGroup]
            Tags: [{ Key: Name, Value: !Sub "${AWS::StackName}-ec2" }]
            UserData:
                Fn::Base64: !Sub |
                    #!/bin/bash
                    set -euxo pipefail
                    dnf -y update
                    dnf -y install git
                    # Instalar Node.js 22
                    curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
                    dnf -y install nodejs
                    # Crear carpeta demo
                    mkdir -p /opt/app && chown -R ec2-user:ec2-user /opt/app

Outputs:
    BucketNameOut:
        Value: !Ref S3Bucket
        Export:
            Name: !Sub "${AWS::StackName}-bucket-name"
    Ec2PublicIp:
        Value: !GetAtt Ec2Instance.PublicIp
    VpcId:
        Value: !Ref VPC
    S3VpceId:
        Value: !Ref S3GatewayEndpoint
```

> El bucket se marca con `DeletionPolicy: Retain` para no perder datos al borrar el stack (elimina manualmente si lo deseas).

### Despliegue del stack

```bash
# Variables
export AWS_REGION=us-east-1
export STACK_NAME=curso-s3-ec2
export KEY_NAME=TU_KEYPAIR

aws cloudformation deploy \
  --template-file s3-ec2-vpcendpoint.yaml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides KeyPairName=$KEY_NAME AllowedSSH=0.0.0.0/0 \
  --region $AWS_REGION

# Obtener salidas
aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs" --output table --region $AWS_REGION
```

Con la **IP pública** de la EC2 podrás conectarte por SSH:

```bash
ssh -i TU_KEY.pem ec2-user@EC2_PUBLIC_IP
```

### Backend NestJS (dentro/desde tu máquina)

Usa el mismo módulo del ejemplo y **NO configures Access Keys** en la EC2: el SDK usará el **Role** adjunto.

Instalación local (o clona en la EC2 si prefieres ejecutarlo ahí):

```bash
npm i -g @nestjs/cli
nest new s3-uploader-api
cd s3-uploader-api
npm i @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/s3-request-presigner
npm i @nestjs/platform-express multer
npm i -D @types/multer @nestjs/config
```

`.env` (solo región y bucket; **sin** llaves en EC2):

```
NODE_ENV=development
AWS_REGION=us-east-1
S3_BUCKET=<BucketNameOut>
PRESIGN_EXPIRES_SECONDS=300
```

Crea los archivos (idénticos al ejemplo anterior):

-   `src/config/config.module.ts` (ConfigModule global)
-   `src/s3/s3.service.ts` (subida + presign GET/PUT con SDK v3)
-   `src/s3/s3.controller.ts` (endpoints `/files/upload`, `/files/presign-put`, `/files/presign-get`)
-   `src/s3/s3.module.ts` y `src/app.module.ts`

Inicia la API:

```bash
npm run start:dev
# o: nest start --watch
```

Prueba la subida vía backend:

```bash
curl -X POST "http://localhost:3000/files/upload" \
  -F "file=@/ruta/local/ejemplo.png"
```

Prueba presigned PUT + GET:

```bash
# Solicitar URL de subida
curl "http://localhost:3000/files/presign-put?filename=ejemplo.png&contentType=image/png"
# Usar la URL devuelta:
curl -X PUT -H "Content-Type: image/png" --upload-file ./ejemplo.png "URL_DEVUELTA"

# Descargar con URL firmada
curl "http://localhost:3000/files/presign-get?key=uploads/1699999999-ejemplo.png"
```

> La **Bucket Policy** niega acceso si la solicitud no proviene del **VPC Endpoint** definido; esto garantiza que la EC2 (o workloads en la VPC) accedan de forma privada a S3.

### Limpieza

```bash
# Si deseas eliminar: primero borra objetos del bucket (incluidas versiones)
aws s3 rm s3://$(aws cloudformation list-exports --query "Exports[?Name=='${STACK_NAME}-bucket-name'].Value" --output text) --recursive --region $AWS_REGION
# Luego elimina el stack
aws cloudformation delete-stack --stack-name $STACK_NAME --region $AWS_REGION
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME --region $AWS_REGION
```

---

## Checklist de producción

-   **BPA activado** y **ACLs deshabilitadas**.
-   **Cifrado por defecto** (SSE-S3 o SSE-KMS) y políticas KMS si aplica.
-   **Roles** (no llaves) y **restricción por VPCE** o por `aws:PrincipalTag`.
-   **VPC Endpoint** para S3; sin NAT si no hay salida a Internet.
-   **Versioning** + **Lifecycle** (expirar no actuales).
-   **CORS mínimo** y **presigned** con expiración corta.
-   **Logging** a bucket separado y **CloudWatch Alarms**.
-   **IaC** versionado (CFN/Terraform) y **etiquetas** de costo.
-   **Pruebas de carga** y **multipart** para archivos grandes.

## Troubleshooting

-   **AccessDenied**: revisa BPA/bucket policy/prefijos/rol; confirma que el tráfico va por **VPCE**.
-   **CORS/Preflight**: habilita `OPTIONS` en cliente y métodos en CORS del bucket.
-   **SignatureDoesNotMatch**: región incorrecta, hora del sistema, headers alterados.
-   **KMSThrottle**: aumenta cuota o agrupa operaciones.
-   **EntityTooLarge**: usa multipart y límites en backend.

---

## Conclusiones

S3 es el pilar de almacenamiento de objetos en AWS. Una postura segura incluye **BPA + cifrado + versionado + políticas mínimas** y acceso **privado** mediante **VPC Endpoint**. Desplegar la infraestructura con **CloudFormation** simplifica reproducibilidad, auditoría y desmontaje. La integración con **NestJS** vía **URLs prefirmadas** optimiza rendimiento y reduce costos al evitar que el backend “proxyée” bytes innecesarios.

---

## Referencias

-   AWS S3 Developer Guide
-   AWS Well-Architected – Storage
-   Ejemplos de **AWS SDK for JavaScript v3** (S3, presigned URLs)
-   Seguridad en S3 y KMS

```bash
export AWS_REGION=us-east-1
export STACK_NAME=curso-s3-ec2
export KEY_NAME=pem-usmp
PORT=3000

aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides KeyPairName=$KEY_NAME AllowedSSH=0.0.0.0/0 \
  --region $AWS_REGION

aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs" --output table --region $AWS_REGION

# Eliminar stack
aws cloudformation delete-stack --stack-name curso-s3-ec2 --region us-east-1
aws cloudformation describe-stacks --stack-name curso-s3-ec2 --region us-east-1
```
