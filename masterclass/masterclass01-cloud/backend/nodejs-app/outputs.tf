output "service_name" {
    description = "Nombre del servicio Kubernetes para la aplicación Node.js"
    value       = kubernetes_service.nodejs_service.metadata[0].name
}

output "service_endpoint" {
    description = "Endpoint del servicio LoadBalancer"
    value       = kubernetes_service.nodejs_service.status[0].load_balancer[0].ingress[0].hostname
}