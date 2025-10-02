# EC2 Spot con CloudFormation — Demo mínima

Este repositorio contiene un ejemplo **mínimo** para lanzar una **instancia EC2 en modo Spot** usando **CloudFormation**. La plantilla usa un **Launch Template** para definir las opciones Spot y luego crea una **instancia EC2** que referencia dicho template.

---

## Requisitos previos

-   **AWS CLI** autenticado y con región por defecto configurada.
-   **Permisos** para usar CloudFormation, EC2, y SSM (lectura de parámetros).
-   **KeyPair existente** en la región (por defecto: `pem-ec2`).
-   **VPC por defecto** y **Security Group por defecto** en la región (si no, deberás especificar Subnet/SG en la plantilla).

### Checks rápidos

```bash
# Verifica que exista el KeyPair
aws ec2 describe-key-pairs --key-names pem-ec2 --query "KeyPairs[0].KeyName"

# Verifica que exista una VPC por defecto
aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query "Vpcs[*].VpcId"
```

---

## ¿Qué hace la plantilla? (flujo)

1. **Parameters**: define valores por defecto (AMI Amazon Linux 2023 vía SSM, tipo `t3.micro`, KeyPair `pem-ec2`, y banderas Spot).
2. **Launch Template** (`AWS::EC2::LaunchTemplate`):
    - Configura **InstanceMarketOptions** como **Spot** con:
        - `SpotInstanceType` (`one-time` o `persistent`)
        - `InstanceInterruptionBehavior` (`terminate`, `stop`, `hibernate`)
        - `MaxPrice` **opcional** (si `SpotMaxPrice` es vacío, no se envía y pagas el precio Spot vigente).
    - Agrega tags a la instancia.
3. **EC2 Instance** (`AWS::EC2::Instance`):
    - Se crea usando el **Launch Template** anterior.
    - Al no definir `SubnetId`/`SecurityGroupIds`, usará los **valores por defecto** de tu cuenta/region (si existen).

---

## Parámetros explicados

| Parámetro                  |                                                   Valor por defecto | Descripción                                                                                        |
| -------------------------- | ------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------- |
| `KeyPairName`              |                                                           `pem-ec2` | Nombre del **KeyPair** existente para SSH. Debe existir en la región.                              |
| `InstanceType`             |                                                          `t3.micro` | Tipo de instancia EC2.                                                                             |
| `AmiId`                    | `/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64` | AMI de **Amazon Linux 2023** obtenida vía **SSM** (SIEMPRE usa la más reciente).                   |
| `SpotInstanceType`         |                                                          `one-time` | Comportamiento de la solicitud Spot: `one-time` (única) o `persistent`.                            |
| `SpotInterruptionBehavior` |                                                         `terminate` | Qué hacer al interrumpirse: `terminate`, `stop` o `hibernate`.                                     |
| `SpotMaxPrice`             |                                                                `""` | Tope de precio/hora. Si se deja vacío, se cobra el **precio Spot vigente** (recomendado en demos). |

---

## Desplegar el stack

```bash
aws cloudformation deploy --stack-name simple-ec2-spot --template-file cloudformation.yml
```

> No es necesario pasar `--parameter-overrides` porque la plantilla trae **defaults**. Asegúrate de que el KeyPair y VPC por defecto existan en tu región.

### Validación opcional antes de desplegar

```bash
aws cloudformation validate-template --template-body file://cloudformation.yml
```

---

## Verificar outputs y recursos

```bash
# Ver salidas del stack (incluye InstanceId)
aws cloudformation describe-stacks --stack-name simple-ec2-spot --query "Stacks[0].Outputs"

# Listar la instancia creada
aws ec2 describe-instances   --filters Name=tag:Module,Values=01 Name=instance-state-name,Values=pending,running   --query "Reservations[].Instances[].{Id:InstanceId,IP:PublicIpAddress,Type:InstanceType,AZ:Placement.AvailabilityZone}"
```

> Si necesitas conectarte por SSH, recuerda que el **Security Group por defecto** puede no permitir puerto 22. En ese caso, agrega un SG explícito en la plantilla o habilita la regla temporalmente.

---

## Eliminar y limpiar el stack

```bash
aws cloudformation delete-stack --stack-name simple-ec2-spot
aws cloudformation wait stack-delete-complete --stack-name simple-ec2-spot
```

---

## Troubleshooting (errores comunes)

-   **`The key pair 'pem-ec2' does not exist`**: crea o importa el KeyPair en la región, o cambia `KeyPairName` en la plantilla.
-   **Sin VPC/SG por defecto**: define `SubnetId` y `SecurityGroupIds` en la instancia o crea una VPC/SG explícitos.
-   **`InsufficientInstanceCapacity` / Spot no arranca**: cambia de AZ, de familia, quita/reduce `SpotMaxPrice` o prueba más tipos de instancia.
-   **SSM Parameter no disponible**: cambia `AmiId` a otro parámetro SSM válido o fija un AMI específico de tu región.
-   **`extraneous key [InstanceMarketOptions] is not permitted`** en `AWS::EC2::Instance`: usa **Launch Template** (como en este ejemplo).

---

## CloudFormation template (cloudformation.yml)

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: >
    Simple EC2 in default VPC and default subnet (Spot via Launch Template).

Parameters:
    KeyPairName:
        Type: AWS::EC2::KeyPair::KeyName
        Default: pem-ec2
        Description: KeyPair existente

    InstanceType:
        Type: String
        Default: t3.micro
        AllowedValues: [t3.micro]
        Description: Tipo de instancia EC2 para la demo.

    AmiId:
        Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
        Default: /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64
        Description: AMI Amazon Linux 2023 desde SSM.

    SpotInstanceType:
        Type: String
        Default: one-time
        AllowedValues: [one-time, persistent]
        Description: Tipo de solicitud Spot.

    SpotInterruptionBehavior:
        Type: String
        Default: terminate
        AllowedValues: [terminate, stop, hibernate]
        Description: Comportamiento al ser interrumpida la instancia Spot.

    SpotMaxPrice:
        Type: String
        Default: "" # Ej.: "0.0100" para tope de precio; vacío = precio spot vigente
        Description: Tope de precio por hora en USD (vacío = on-market).

Conditions:
    HasMaxPrice: !Not [!Equals [!Ref SpotMaxPrice, ""]]

Resources:
    DemoLaunchTemplate:
        Type: AWS::EC2::LaunchTemplate
        Properties:
            LaunchTemplateName: demo-spot-lt
            LaunchTemplateData:
                ImageId: !Ref AmiId
                InstanceType: !Ref InstanceType
                KeyName: !Ref KeyPairName
                InstanceMarketOptions:
                    MarketType: spot
                    SpotOptions:
                        SpotInstanceType: !Ref SpotInstanceType
                        InstanceInterruptionBehavior: !Ref SpotInterruptionBehavior
                        # MaxPrice solo si el parámetro viene con valor
                        # (Fn::If no puede ir "inline" en mapas sin clave, así que lo ponemos aquí)
                        # Cuando false => se omite (AWS::NoValue)
                        MaxPrice:
                            !If [
                                HasMaxPrice,
                                !Ref SpotMaxPrice,
                                !Ref "AWS::NoValue",
                            ]
                TagSpecifications:
                    - ResourceType: instance
                      Tags:
                          - Key: Module
                            Value: 01

    DemoInstance:
        Type: AWS::EC2::Instance
        Properties:
            LaunchTemplate:
                LaunchTemplateId: !Ref DemoLaunchTemplate
                Version: !GetAtt DemoLaunchTemplate.LatestVersionNumber
            # Sin SubnetId ni SG explícitos: usa VPC y SG por defecto (si existen)

Outputs:
    InstanceId:
        Description: ID de la instancia creada
        Value: !Ref DemoInstance
```

---

## Personalización rápida

-   **Cambiar tipo**: modifica `InstanceType` (p. ej., `t3.small`).
-   **Interrupción**: usa `stop` o `hibernate` si tu flujo lo requiere.
-   **Tope de precio**: asigna `SpotMaxPrice` (ej. `"0.0100"`).
-   **Red/seguridad**: añade `SubnetId` y `SecurityGroupIds` si no tienes VPC/SG por defecto.

---

## Costos

-   Las instancias **Spot** suelen ser **mucho más baratas** que On-Demand, pero pueden ser **interrumpidas** con aviso de ~2 minutos. Para cargas críticas, combina Spot con On-Demand o RI/Savings Plans.
