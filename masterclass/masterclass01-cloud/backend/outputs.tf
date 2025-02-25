output "eks_cluster_name" {
    description = "Nombre del clúster EKS"
    value       = module.eks.cluster_name
}

output "api_gateway_url" {
    description = "URL del API Gateway"
    value       = module.api_gateway.api_url
}