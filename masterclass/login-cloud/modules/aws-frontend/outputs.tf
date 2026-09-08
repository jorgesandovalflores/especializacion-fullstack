output "bucket_name" {
  description = "Nombre del bucket S3 que aloja los archivos estáticos del frontend"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "ID de la distribución CloudFront (útil para invalidar cache en el deploy)"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "Dominio público de CloudFront (*.cloudfront.net)"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "url" {
  description = "URL pública del frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
