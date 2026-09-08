output "frontend_url" {
  description = "URL pública del frontend"
  value       = module.frontend.url
}

output "frontend_load_balancer_ip" {
  description = "IP pública del Load Balancer (apuntar el DNS del dominio aquí)"
  value       = module.frontend.load_balancer_ip
}

output "frontend_bucket_name" {
  description = "Bucket GCS donde se sube el build del frontend"
  value       = module.frontend.bucket_name
}

output "backend_function_url" {
  description = "URL pública de la función (Cloud Run function)"
  value       = module.backend.function_url
}
