# README — Simple EC2 en CloudFormation (Free Tier)

Este laboratorio despliega **una instancia EC2 mínima** usando **CloudFormation**. 
El template está diseñado para la **capa gratuita** (Free Tier) usando `t3.micro` y la **AMI de Amazon Linux 2023** resuelta dinámicamente con **SSM Parameter Store**.

---

## 1) Prerrequisitos

- Tener un **Key Pair** existente en la región (ej.: `pem-ec2`). Verifica con:
  ```bash
  aws ec2 describe-key-pairs --query "KeyPairs[].KeyName" --output table
  ```
- Tener **VPC y subred por defecto** en la región (la mayoría de cuentas nuevas lo tienen):
  ```bash
  aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query "Vpcs[].VpcId"
  aws ec2 describe-subnets --filters Name=default-for-az,Values=true --query "Subnets[].SubnetId"
  ```
- **AWS CLI** autenticado y con región configurada (`aws configure` o perfiles).

> Si tu región tiene Free Tier con `t2.micro` (en lugar de `t3.micro`), cambia el parámetro `InstanceType` en el deploy o ajusta el template.

---

## 2) Template (explicado línea por línea)

Archivo: `cloudformation.yml`

```yaml
AWSTemplateFormatVersion: "2010-09-09"
```
- Versión de formato de template de CloudFormation (convención estándar).

```yaml
Description: >
    Simple EC2 in default VPC and default subnet.
```
- Descripción breve del stack; útil en la consola y auditoría.

### Parameters
```yaml
Parameters:
    KeyPairName:
        Type: AWS::EC2::KeyPair::KeyName
        Default: pem-ec2
        Description: KeyPair existente
```
- **KeyPairName**: nombre exacto del par de claves registrado en EC2. CloudFormation valida que exista en la región. 
- `Default: pem-ec2` evita pasar el parámetro en el deploy si tu Key Pair se llama así.

```yaml
    InstanceType:
        Type: String
        Default: t3.micro
        AllowedValues:
            - t3.micro
        Description: Tipo de instancia EC2 para la demo.
```
- **InstanceType**: restringido a `t3.micro` para mitigar riesgos de costos y mantener Free Tier. 
- Si tu Free Tier es `t2.micro`, puedes cambiar el `Default` y `AllowedValues` a `t2.micro`.

```yaml
    AmiId:
        Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
        Default: /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64
        Description: AMI obtenida por SSM (Amazon Linux 2023).
```
- **AmiId**: en lugar de hardcodear `ami-xxxxxxxx`, se usa un **parámetro SSM** que apunta a la última AMI oficial de Amazon Linux 2023 **x86_64** para la región. 
- Ventaja: reproducibilidad y menos mantenimiento. 
- Si usas `t4g.micro` (ARM), cambia el default a:  
  `/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-arm64`

### Resources
```yaml
Resources:
    DemoInstance:
        Type: AWS::EC2::Instance
        Properties:
            ImageId: !Ref AmiId # AMI por SSM
            InstanceType: !Ref InstanceType
            KeyName: !Ref KeyPairName # KeyPair requerido
            # Sin SubnetId ni SG explícitos: usa la subred y SG por defecto de la VPC
            Tags:
                - Key: Module
                  Value: 01
```
- **DemoInstance**: recurso principal EC2.
  - `ImageId`: referencia al parámetro `AmiId` (SSM resolverá el ID real).
  - `InstanceType`: `t3.micro` por defecto (Free Tier).
  - `KeyName`: enlaza el Key Pair para SSH.
  - **Subnet y SG**: al no especificarlos, EC2 tomará **la subred por defecto** y el **Security Group por defecto** de la VPC **de la región** (comportamiento recomendado para un lab mínimo).  
  - `Tags`: etiqueta de ejemplo (`Module: 01`) para fines de demo/finops.

### Outputs
```yaml
Outputs:
    InstanceId:
        Description: ID de la instancia creada
        Value: !Ref DemoInstance
```
- Expone el **ID de la instancia** creada para uso posterior (scripts, integraciones).

---

## 3) Comandos de uso

### 3.1 Desplegar el stack
```bash
aws cloudformation deploy   --stack-name simple-ec2   --template-file cloudformation.yml   --parameter-overrides KeyPairName=pem-ec2 InstanceType=t3.micro
```
> Si el `Default` de `KeyPairName` en el template coincide con el tuyo, puedes omitir `--parameter-overrides` por completo.

### 3.2 Ver salidas del stack
```bash
aws cloudformation describe-stacks   --stack-name simple-ec2   --query "Stacks[0].Outputs"
```

### 3.3 Conectar por SSH
- Obtén la IP pública desde la consola de EC2 o con:
  ```bash
  aws ec2 describe-instances     --filters Name=tag:Name,Values=simple-ec2-demo Name=instance-state-name,Values=running     --query "Reservations[].Instances[].PublicIpAddress"     --output text
  ```
- Conéctate (sustituye la ruta de tu `.pem` y la IP):
  ```bash
  ssh -i ~/Downloads/pem-ec2.pem ec2-user@<ip-publica>
  ```

### 3.4 Actualizar el stack (ej. cambiar InstanceType)
```bash
aws cloudformation deploy   --stack-name simple-ec2   --template-file cloudformation.yml   --parameter-overrides KeyPairName=pem-ec2 InstanceType=t3.micro
```

### 3.5 Eliminar el stack
```bash
aws cloudformation delete-stack --stack-name simple-ec2
aws cloudformation wait stack-delete-complete --stack-name simple-ec2
```

---

## 4) Solución de problemas comunes

- **`Parameters: [KeyPairName] must have values`**  
  Añade `Default` al parámetro o pásalo en `--parameter-overrides KeyPairName=<tu-keypair>`.

- **`InvalidKeyPair.NotFound`**  
  El key pair no existe en **esa región**. Verifica con `describe-key-pairs` o cambia de región.

- **`The specified instance type is not eligible for Free Tier`**  
  En tu región/cuenta el Free Tier puede ser `t2.micro`, `t3.micro` o `t4g.micro`. Compruébalo:
  ```bash
  aws ec2 describe-instance-types     --filters Name=free-tier-eligible,Values=true     --query "InstanceTypes[].InstanceType" --output table
  ```
  - Si usas `t4g.micro` (ARM), cambia `AmiId` a la AMI **arm64**.

- **`Stack is in ROLLBACK_COMPLETE and cannot be updated`**  
  Elimina el stack y vuelve a crear:
  ```bash
  aws cloudformation delete-stack --stack-name simple-ec2
  aws cloudformation wait stack-delete-complete --stack-name simple-ec2
  ```

- **No tienes VPC/Subred por defecto**  
  Crea una VPC por defecto:
  ```bash
  aws ec2 create-default-vpc
  ```
  O bien, modifica el template para pasar `SubnetId` y `SecurityGroupId` explícitos.

---

## 5) Variantes útiles (opcionales para clase)

- **User Data (instalar NGINX en el arranque)**:
  ```yaml
  UserData:
    Fn::Base64: |
      #!/bin/bash
      yum update -y
      yum install -y nginx
      systemctl enable nginx
      systemctl start nginx
  ```

- **Forzar etiquetas estándar** (FinOps/seguridad):
  ```yaml
  Tags:
    - Key: Project
      Value: Curso-Cloud
    - Key: Owner
      Value: Estudiante
    - Key: Env
      Value: dev
  ```

---

## 6) Limpieza y costos

- Este lab está pensado para **Free Tier** con `t3.micro` (o `t2.micro` según tu región). 
- **Siempre elimina el stack** al terminar la clase para evitar costos.
