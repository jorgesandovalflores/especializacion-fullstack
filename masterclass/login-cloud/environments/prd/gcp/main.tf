locals {
  labels = {
    project     = var.project_name
    environment = var.environment
    managed-by  = "terraform"
  }
}

module "frontend" {
  source = "../../../modules/gcp-frontend"

  project_id   = var.gcp_project_id
  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.frontend_domain
  enable_https = var.enable_https
  labels       = local.labels
}

module "backend" {
  source = "../../../modules/gcp-backend"

  project_id   = var.gcp_project_id
  project_name = var.project_name
  environment  = var.environment
  region       = var.gcp_region

  available_memory   = var.function_memory
  max_instance_count = var.function_max_instances

  environment_variables = {
    NODE_ENV = var.environment
  }

  labels = local.labels
}
