variable "gcp_project_id" {
  description = "ID del proyecto GCP de este entorno"
  type        = string
  default     = "login-cloud-dev"
}

variable "gcp_region" {
  description = "Región de GCP donde se despliega la función"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Nombre del entorno"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre base del proyecto"
  type        = string
  default     = "login-cloud"
}

variable "frontend_domain" {
  description = "Dominio público del frontend en este entorno"
  type        = string
  default     = "dev.login.example.com"
}

variable "enable_https" {
  description = "Habilita el certificado SSL administrado y el listener HTTPS (requiere dominio propio apuntando al Load Balancer)"
  type        = bool
  default     = false
}

variable "function_memory" {
  description = "Memoria asignada a la función (ej: 256Mi, 512Mi)"
  type        = string
  default     = "256Mi"
}

variable "function_max_instances" {
  description = "Máximo de instancias concurrentes de la función"
  type        = number
  default     = 10
}
