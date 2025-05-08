variable "cluster_name" {
    description = "Nombre del clúster EKS"
    type        = string
}

variable "aws_region" {
    description = "Región de AWS donde se desplegará el clúster"
    type        = string
}