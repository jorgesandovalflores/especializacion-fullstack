output "frontend_url" {
  description = "URL pública del frontend (CloudFront)"
  value       = module.frontend.url
}

output "cloudfront_distribution_id" {
  description = "ID de la distribución CloudFront (para invalidar cache en el deploy)"
  value       = module.frontend.cloudfront_distribution_id
}

output "frontend_bucket_name" {
  description = "Bucket S3 donde se sube el build del frontend"
  value       = module.frontend.bucket_name
}

output "backend_api_endpoint" {
  description = "URL pública de la API (API Gateway + Lambda)"
  value       = module.backend.api_endpoint
}
