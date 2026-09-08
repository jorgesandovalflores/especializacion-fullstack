variable "aws_region" {
  description = "Región de AWS donde se despliegan los recursos"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nombre del entorno"
  type        = string
  default     = "prd"
}

variable "project_name" {
  description = "Nombre base del proyecto"
  type        = string
  default     = "login-cloud"
}

variable "cloudfront_price_class" {
  description = "Price class de CloudFront (PriceClass_100 = NA+EU, PriceClass_All = global)"
  type        = string
  default     = "PriceClass_All"
}

variable "lambda_memory_size" {
  description = "Memoria asignada a la función Lambda (MB)"
  type        = number
  default     = 1024
}

variable "lambda_timeout" {
  description = "Timeout de la función Lambda (segundos)"
  type        = number
  default     = 15
}

variable "cors_allow_origins" {
  description = "Orígenes permitidos por CORS en la API (el dominio de CloudFront del frontend)"
  type        = list(string)
  default     = ["https://login.example.com"]
}
