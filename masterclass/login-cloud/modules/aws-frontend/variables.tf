variable "project_name" {
  description = "Nombre base del proyecto, usado como prefijo de los recursos"
  type        = string
}

variable "environment" {
  description = "Nombre del entorno (dev, stg, prd)"
  type        = string
}

variable "price_class" {
  description = "Price class de la distribución CloudFront"
  type        = string
  default     = "PriceClass_100"
}

variable "default_root_object" {
  description = "Documento raíz servido por CloudFront"
  type        = string
  default     = "index.html"
}

variable "spa_fallback_document" {
  description = "Documento al que se redirige en 403/404 para soportar el enrutado del SPA (vue-router)"
  type        = string
  default     = "/index.html"
}

variable "tags" {
  description = "Tags comunes aplicados a los recursos"
  type        = map(string)
  default     = {}
}
