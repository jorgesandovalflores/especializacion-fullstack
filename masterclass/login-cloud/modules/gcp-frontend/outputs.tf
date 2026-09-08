output "bucket_name" {
  description = "Nombre del bucket GCS que aloja los archivos estáticos del frontend"
  value       = google_storage_bucket.frontend.name
}

output "load_balancer_ip" {
  description = "IP pública del Load Balancer (apuntar el DNS del dominio aquí)"
  value       = google_compute_global_address.frontend.address
}

output "url" {
  description = "URL pública del frontend"
  value       = var.enable_https ? "https://${var.domain_name}" : "http://${google_compute_global_address.frontend.address}"
}
