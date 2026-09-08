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

variable "location" {
  description = "Ubicación del bucket de GCS (multi-región o región)"
  type        = string
  default     = "US"
}

variable "domain_name" {
  description = "Dominio público del frontend para este entorno (ej: dev.login.midominio.com). Requerido para emitir el certificado SSL administrado."
  type        = string
}

variable "enable_https" {
  description = "Crea el certificado SSL administrado y el listener HTTPS (requiere que el dominio ya resuelva o pueda validarse)"
  type        = bool
  default     = true
}

variable "labels" {
  description = "Labels comunes aplicados a los recursos"
  type        = map(string)
  default     = {}
}
