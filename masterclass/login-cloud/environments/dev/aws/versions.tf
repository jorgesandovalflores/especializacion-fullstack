terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend remoto recomendado para un entorno real (requiere crear antes el
  # bucket S3 y la tabla DynamoDB de locking). Se deja en local por defecto
  # para que el proyecto se pueda ejecutar sin infraestructura previa.
  #
  # backend "s3" {
  #   bucket         = "login-cloud-tfstate"
  #   key            = "dev/aws/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "login-cloud-tf-locks"
  #   encrypt        = true
  # }
}
