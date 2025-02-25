module "eks" {
    source = "./eks"
    cluster_name = var.cluster_name
    aws_region  = var.aws_region
}

module "nodejs_app" {
    source = "./nodejs-app"
    cluster_name = module.eks.cluster_name
    nodejs_image = var.nodejs_image
}

module "api_gateway" {
    source = "./api-gateway"
    eks_cluster_name = module.eks.cluster_name
}