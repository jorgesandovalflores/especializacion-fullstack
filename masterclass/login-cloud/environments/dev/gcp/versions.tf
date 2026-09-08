terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  # Backend remoto recomendado para un entorno real (requiere crear antes el
  # bucket GCS). Se deja en local por defecto para que el proyecto se pueda
  # ejecutar sin infraestructura previa.
  #
  # backend "gcs" {
  #   bucket = "login-cloud-tfstate"
  #   prefix = "dev/gcp"
  # }
}
