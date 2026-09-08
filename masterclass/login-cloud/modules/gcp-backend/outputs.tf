output "function_name" {
  description = "Nombre de la función (Cloud Run function, 2nd gen)"
  value       = google_cloudfunctions2_function.api.name
}

output "function_url" {
  description = "URL pública HTTPS de la función"
  value       = google_cloudfunctions2_function.api.url
}
