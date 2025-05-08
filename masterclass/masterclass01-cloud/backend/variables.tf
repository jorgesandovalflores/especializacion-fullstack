variable "aws_region" {
    description = "Región de AWS donde se desplegarán los recursos"
    type        = string
    default     = "us-west-2"
}

variable "cluster_name" {
    description = "Nombre del clúster EKS"
    type        = string
    default     = "my-eks-cluster"
}

variable "nodejs_image" {
    description = "Nombre de la imagen Docker de Node.js"
    type        = string
    default     = "my-nodejs-app:latest"
}