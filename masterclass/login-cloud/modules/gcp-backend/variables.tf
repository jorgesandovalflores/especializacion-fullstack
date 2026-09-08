variable "project_id" {
  description = "ID del proyecto GCP"
  type        = string
}

variable "project_name" {
  description = "Nombre base del proyecto, usado como prefijo de los recursos"
  type        = string
}

variable "environment" {
  description = "Nombre del entorno (dev, stg, prd)"
  type        = string
}

variable "region" {
  description = "Región donde se despliega la función"
  type        = string
  default     = "us-central1"
}

variable "source_dir" {
  description = "Directorio con el código fuente real del backend. Si es null se empaqueta el placeholder incluido en el módulo."
  type        = string
  default     = null
}

variable "runtime" {
  description = "Runtime de Cloud Run functions"
  type        = string
  default     = "nodejs20"
}

variable "entry_point" {
  description = "Nombre de la función exportada que maneja las requests"
  type        = string
  default     = "handler"
}

variable "available_memory" {
  description = "Memoria asignada (ej: 256Mi, 512Mi)"
  type        = string
  default     = "256Mi"
}

variable "timeout_seconds" {
  description = "Timeout de la función (segundos)"
  type        = number
  default     = 60
}

variable "max_instance_count" {
  description = "Máximo de instancias concurrentes"
  type        = number
  default     = 10
}

variable "environment_variables" {
  description = "Variables de entorno inyectadas a la función"
  type        = map(string)
  default     = {}
}

variable "allow_unauthenticated" {
  description = "Permite invocar la función sin autenticación (equivalente a exponer la API públicamente, como en API Gateway + Lambda)"
  type        = bool
  default     = true
}

variable "labels" {
  description = "Labels comunes aplicados a los recursos"
  type        = map(string)
  default     = {}
}
