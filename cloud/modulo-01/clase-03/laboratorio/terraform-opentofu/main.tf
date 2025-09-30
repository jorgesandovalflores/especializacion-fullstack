# Datos: AMI Amazon Linux 2023 y subred por defecto de la AZ
data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64"
}

# Subred por defecto de la AZ indicada (más simple para la demo)
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

# EC2 mínima: usa SG por defecto; asigna IP pública si la subred por defecto es pública
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

output "instance_id" {
  value = aws_instance.simple.id
}

output "public_ip" {
  value = aws_instance.simple.public_ip
}