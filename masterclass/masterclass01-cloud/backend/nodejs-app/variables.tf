variable "cluster_name" {
    description = "Nombre del clúster EKS donde se desplegará la aplicación"
    type        = string
}

variable "nodejs_image" {
    description = "Nombre de la imagen Docker de Node.js"
    type        = string
}