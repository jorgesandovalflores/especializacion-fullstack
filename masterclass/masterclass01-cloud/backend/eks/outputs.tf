output "cluster_name" {
    description = "Nombre del clúster EKS"
    value       = aws_eks_cluster.cluster.name
}

output "cluster_endpoint" {
    description = "Endpoint del clúster EKS"
    value       = aws_eks_cluster.cluster.endpoint
}

output "kubeconfig" {
    description = "Configuración de kubectl para el clúster"
    value       = <<EOT
    apiVersion: v1
    clusters:
    - cluster:
        server: ${aws_eks_cluster.cluster.endpoint}
        certificate-authority-data: ${aws_eks_cluster.cluster.certificate_authority.0.data}
    name: kubernetes
    contexts:
    - context:
        cluster: kubernetes
        user: aws
    name: aws
    current-context: aws
    kind: Config
    preferences: {}
    users:
    - name: aws
    user:
        exec:
        apiVersion: client.authentication.k8s.io/v1beta1
        command: aws
        args:
            - "eks"
            - "get-token"
            - "--cluster-name"
            - ${aws_eks_cluster.cluster.name}
    EOT
}