variable "project_name" {
  description = "Nombre base del proyecto, usado como prefijo de los recursos"
  type        = string
}

variable "environment" {
  description = "Nombre del entorno (dev, stg, prd)"
  type        = string
}

variable "deployment_package" {
  description = "Ruta a un .zip con el build real del backend. Si es null se empaqueta el placeholder incluido en el módulo."
  type        = string
  default     = null
}

variable "runtime" {
  description = "Runtime de Lambda"
  type        = string
  default     = "nodejs20.x"
}

variable "handler" {
  description = "Handler de Lambda (archivo.export)"
  type        = string
  default     = "index.handler"
}

variable "memory_size" {
  description = "Memoria asignada a la función (MB)"
  type        = number
  default     = 512
}

variable "timeout" {
  description = "Timeout de la función (segundos)"
  type        = number
  default     = 10
}

variable "environment_variables" {
  description = "Variables de entorno inyectadas a la función Lambda"
  type        = map(string)
  default     = {}
}

variable "cors_allow_origins" {
  description = "Orígenes permitidos por CORS en la API HTTP (por ejemplo, el dominio de CloudFront)"
  type        = list(string)
  default     = ["*"]
}

variable "log_retention_days" {
  description = "Días de retención de los logs en CloudWatch"
  type        = number
  default     = 14
}

variable "tags" {
  description = "Tags comunes aplicados a los recursos"
  type        = map(string)
  default     = {}
}
