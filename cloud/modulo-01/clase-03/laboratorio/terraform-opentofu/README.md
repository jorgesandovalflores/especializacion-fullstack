# Laboratorio — EC2 con OpenTofu

Este laboratorio despliega una **instancia EC2 mínima** usando **OpenTofu** (fork de Terraform).  
Se apoya en la **VPC y subred por defecto** de la región y utiliza la **AMI de Amazon Linux 2023** resuelta dinámicamente con **SSM Parameter Store**.

---

## 1) Instalación de OpenTofu

### macOS / Linux (Homebrew)
```bash
brew install opentofu
```

### Verificar instalación
```bash
tofu -v
```

Deberías ver una versión mayor o igual a `1.6.0`.

---

## 2) Archivos del proyecto

### `versions.tf`
```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}
```
- Define la versión mínima de OpenTofu/Terraform (`>= 1.6.0`).
- Configura el **provider AWS** con versión 5.x.
- La `region` se toma de la variable `var.region`.

---

### `variables.tf`
```hcl
variable "region" {
  type        = string
  default     = "us-east-1"
  description = "Región AWS"
}

variable "az" {
  type        = string
  default     = "us-east-1a"
  description = "AZ para elegir la subred por defecto"
}

variable "key_name" {
  type        = string
  default     = "pem-ec2"
  description = "Nombre de KeyPair existente para SSH"
}

variable "instance_type" {
  type        = string
  default     = "t3.micro"
  description = "Tipo de instancia"
}
```
- **region**: región AWS (ej. `us-east-1`).  
- **az**: zona de disponibilidad para elegir una subred por defecto.  
- **key_name**: nombre de tu Key Pair (ej. `pem-ec2`).  
- **instance_type**: tipo de instancia (ej. `t3.micro` para Free Tier).

---

### `main.tf`
```hcl
# AMI Amazon Linux 2023 obtenida dinámicamente
data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64"
}

# Subred por defecto en la AZ indicada
data "aws_subnet" "default_az" {
  filter {
    name   = "default-for-az"
    values = ["true"]
  }

  filter {
    name   = "availability-zone"
    values = [var.az]
  }
}

# Instancia EC2 mínima
resource "aws_instance" "simple" {
  ami                         = data.aws_ssm_parameter.al2023.value
  instance_type               = var.instance_type
  subnet_id                   = data.aws_subnet.default_az.id
  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = {
    Module = "01"
  }
}

# Salidas útiles
output "instance_id" {
  value = aws_instance.simple.id
}

output "public_ip" {
  value = aws_instance.simple.public_ip
}
```
- Obtiene la **última AMI** de Amazon Linux 2023 (x86_64) desde SSM.
- Usa la **subred por defecto** en la AZ indicada.
- Crea una EC2 mínima con IP pública.
- Devuelve `instance_id` y `public_ip` al final del deploy.

---

## 3) Archivos y carpetas autogeneradas por OpenTofu

Cuando inicializas o aplicas, OpenTofu crea:
- `.terraform/` → directorio con plugins y configuraciones internas.  
- `.terraform.lock.hcl` → archivo de bloqueo de dependencias (versiones exactas de providers).  
- `terraform.tfstate` → archivo de estado local (qué recursos existen en AWS).  
- `terraform.tfstate.backup` → respaldo automático del estado.

> ⚠️ El archivo `terraform.tfstate` contiene IDs y datos sensibles. No subir a GitHub.

---

## 4) Inicialización del proyecto

### Inicializar
```bash
tofu init
```

### Ver plan de ejecución
```bash
tofu plan -var="key_name=pem-ec2"
```

---

## 5) Comandos útiles

### Desplegar (crear EC2)
```bash
tofu apply -auto-approve -var="key_name=pem-ec2"
```

### Ver salidas
```bash
tofu output
# o directamente
tofu output public_ip
```

### Conectar por SSH
```bash
ssh -i pem-ec2.pem ec2-user@$(tofu output -raw public_ip)
```

### Destruir recursos (eliminar EC2)
```bash
tofu destroy -auto-approve -var="key_name=pem-ec2"
```

### Ver estado
```bash
tofu state list
```

---

## 6) Troubleshooting

- **`InvalidKeyPair.NotFound`** → el `key_name` no existe en esa región. Verifica con:
  ```bash
  aws ec2 describe-key-pairs --query "KeyPairs[].KeyName" --output table
  ```
- **Timeout al conectar por SSH** → abre puerto 22 en el Security Group por defecto para tu IP:
  ```bash
  aws ec2 authorize-security-group-ingress     --group-id <sg-id>     --protocol tcp --port 22     --cidr $(curl -s https://checkip.amazonaws.com)/32
  ```
- **Free Tier** → si tu región no permite `t3.micro`, cambia `var.instance_type` a `t2.micro` o `t4g.micro` (con AMI `arm64`).

---

## 7) Limpieza de costos
Al terminar la práctica:
```bash
tofu destroy -auto-approve -var="key_name=pem-ec2"
```
y borra los archivos `.terraform/` y `terraform.tfstate` si quieres empezar limpio.
