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