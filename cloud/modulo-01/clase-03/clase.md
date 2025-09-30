
# Clase 03 – Automatización y Scripting en AWS

## Objetivos
1. Entender la importancia de la automatización en la nube y cómo ha cambiado la forma de operar sistemas.  
2. Conocer el origen y evolución de las principales herramientas: AWS CLI, CloudFormation y Terraform.  
3. Aprender los conceptos técnicos y prácticos de cada herramienta.  
4. Ver cómo se aplican en un ejemplo real de despliegue automatizado.  

---

## 1) Uso de AWS CLI y SDKs  

### Historia y contexto  
Cuando AWS nació en 2006, la única forma de crear infraestructura era **entrar a la consola web** y hacer clic en botones. Pero a medida que crecieron los servicios, se hizo evidente que **hacer clic no escala**. Ahí aparece la **AWS CLI**, lanzada en 2013 como la primera forma oficial de interactuar de manera programática con los servicios de AWS.  

Los SDKs ya existían desde antes (ej. Boto para Python, AWS SDK for Java), pero eran más “pesados”. La CLI democratizó el acceso: cualquier ingeniero podía crear una instancia EC2 desde su terminal sin abrir un navegador.  

Hoy en día, la CLI y los SDKs son la **base de la automatización**, y aunque existen herramientas más avanzadas, siguen siendo imprescindibles.

### Detalle técnico  
- **AWS CLI**: interfaz de línea de comandos que traduce comandos en llamadas a la API de AWS.  
- **SDKs**: librerías para lenguajes de programación que permiten interactuar con AWS en código.  
- **Buenas prácticas**: usar perfiles (`aws configure`), credenciales temporales (STS o SSO) y filtrar datos con JMESPath (`--query`).  

Ejemplo CLI:  
```bash
aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId"
```

Ejemplo SDK (Python con Boto3):  
```python
import boto3
ec2 = boto3.client("ec2")
for r in ec2.describe_instances()["Reservations"]:
    for i in r["Instances"]:
        print(i["InstanceId"])
```

---

## 2) Automatización con AWS CloudFormation  

### Historia y contexto  
CloudFormation nació en **2011**. En ese momento AWS ya tenía decenas de servicios y se necesitaba una forma de **describir infraestructura en archivos**, algo que pudiera versionarse, compartirse y repetirse.  

Su nombre viene de “formar nubes” a partir de plantillas. Fue la primera implementación nativa de **Infrastructure as Code (IaC)** en AWS.  

Aunque hoy compite con Terraform y otras herramientas, sigue siendo clave para clientes que quieren **100% integración nativa** con AWS.  

### Detalle técnico  
- CloudFormation usa **templates YAML/JSON** para describir recursos.  
- Estos templates se despliegan en **stacks** (una unidad de recursos con ciclo de vida completo: create, update, delete).  
- Tiene conceptos como **Change Sets** (vista previa de cambios), **Drift Detection** (diferencias entre template y realidad) y **StackSets** (multi-cuenta y multi-región).  

Ejemplo mínimo de bucket S3:  
```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: mi-bucket-demo
```

---

## 3) Introducción a Terraform en AWS  

### Historia y contexto  
Terraform fue creado por **HashiCorp** en 2014, una empresa fundada por Mitchell Hashimoto y Armon Dadgar. HashiCorp también creó Vagrant, Consul, Vault y Nomad.  

Terraform fue una revolución porque no solo permitía IaC en AWS, sino en **cualquier nube**: Azure, Google Cloud, Kubernetes, etc.  

En 2023, HashiCorp fue **adquirida por IBM** en un movimiento que generó controversia: pasó su licencia de open source (MPL) a una más restrictiva (BSL), lo que causó la creación de forks comunitarios como **OpenTofu**.  

Hoy Terraform sigue siendo el estándar de facto en la industria para multi-cloud, aunque la comunidad vigila de cerca los cambios de licencia.  

### Detalle técnico  
- Lenguaje: **HCL (HashiCorp Configuration Language)**, fácil de leer y escribir.  
- Concepto central: el **estado** (`terraform.tfstate`), que guarda el mapeo entre archivos de configuración y recursos reales.  
- **Backend remoto** (ej. S3 con DynamoDB lock) es crítico en equipos para evitar conflictos.  
- Admite **módulos reutilizables**, **workspaces** (multi-entorno) y **lifecycle rules** (ej. `prevent_destroy`).  

Ejemplo mínimo en AWS:  
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "demo" {
  bucket = "mi-bucket-terraform"
}
```

Comandos:  
```bash
terraform init
terraform plan
terraform apply
```

---

## 4) Ejemplo de despliegue automatizado  

### Historia y contexto  
Antes de IaC, desplegar un servidor podía tardar **días o semanas**, con tickets al área de infraestructura, instalación manual de paquetes, configuración de redes, etc.  
Con IaC, podemos **versionar la infraestructura en Git**, desplegarla en minutos y garantizar que todos los entornos (dev, qa, prod) son idénticos.  

### Ejemplo práctico  
Queremos desplegar un **bucket S3** y una **instancia EC2**.

- Con AWS CLI:  
  ```bash
  aws s3 mb s3://bucket-cli-demo
  aws ec2 run-instances --image-id ami-123456 --count 1 --instance-type t2.micro
  ```

- Con CloudFormation (YAML):  
  ```yaml
  Resources:
    MyInstance:
      Type: AWS::EC2::Instance
      Properties:
        InstanceType: t2.micro
        ImageId: ami-123456
  ```

- Con Terraform:  
  ```hcl
  resource "aws_instance" "demo" {
    ami           = "ami-123456"
    instance_type = "t2.micro"
  }
  ```

---

## Conclusiones  
- AWS CLI y SDKs son el “primer paso” hacia la automatización programática.  
- CloudFormation representa la apuesta nativa de AWS por IaC.  
- Terraform (y OpenTofu) son el estándar en multi-cloud, con una historia de innovación y también de polémica.  
- La automatización no es solo técnica: es un cambio cultural hacia **infraestructura como software**.  
