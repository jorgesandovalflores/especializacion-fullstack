locals {
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

module "frontend" {
  source = "../../../modules/aws-frontend"

  project_name = var.project_name
  environment  = var.environment
  price_class  = var.cloudfront_price_class
  tags         = local.tags
}

module "backend" {
  source = "../../../modules/aws-backend"

  project_name = var.project_name
  environment  = var.environment
  memory_size  = var.lambda_memory_size
  timeout      = var.lambda_timeout

  cors_allow_origins = var.cors_allow_origins

  environment_variables = {
    NODE_ENV = var.environment
  }

  tags = local.tags
}
