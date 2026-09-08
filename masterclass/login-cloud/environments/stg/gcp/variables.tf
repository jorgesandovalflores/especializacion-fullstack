variable "gcp_project_id" {
  description = "ID del proyecto GCP de este entorno"
  type        = string
  default     = "login-cloud-stg"
}

variable "gcp_region" {
  description = "Región de GCP donde se despliega la función"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Nombre del entorno"
  type        = string
  default     = "stg"
}

variable "project_name" {
  description = "Nombre base del proyecto"
  type        = string
  default     = "login-cloud"
}

variable "frontend_domain" {
  description = "Dominio público del frontend en este entorno"
  type        = string
  default     = "stg.login.example.com"
}

variable "enable_https" {
  description = "Habilita el certificado SSL administrado y el listener HTTPS (requiere dominio propio apuntando al Load Balancer)"
  type        = bool
  default     = true
}

variable "function_memory" {
  description = "Memoria asignada a la función (ej: 256Mi, 512Mi)"
  type        = string
  default     = "512Mi"
}

variable "function_max_instances" {
  description = "Máximo de instancias concurrentes de la función"
  type        = number
  default     = 20
}
