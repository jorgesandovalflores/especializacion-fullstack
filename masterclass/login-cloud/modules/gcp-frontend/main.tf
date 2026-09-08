locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "google_storage_bucket" "frontend" {
  project                     = var.project_id
  name                        = "${local.name_prefix}-frontend-${random_id.bucket_suffix.hex}"
  location                    = var.location
  uniform_bucket_level_access = true
  force_destroy               = true
  labels                      = var.labels

  website {
    main_page_suffix = "index.html"
    # El SPA maneja sus propias rutas (vue-router): cualquier 404 sirve
    # index.html para que el router del lado del cliente resuelva.
    not_found_page = "index.html"
  }
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_compute_backend_bucket" "frontend" {
  project     = var.project_id
  name        = "${local.name_prefix}-backend-bucket"
  bucket_name = google_storage_bucket.frontend.name
  enable_cdn  = true

  cdn_policy {
    cache_mode  = "CACHE_ALL_STATIC"
    default_ttl = 3600
    client_ttl  = 3600
    max_ttl     = 86400
  }
}

resource "google_compute_url_map" "frontend" {
  project         = var.project_id
  name            = "${local.name_prefix}-url-map"
  default_service = google_compute_backend_bucket.frontend.self_link
}

resource "google_compute_global_address" "frontend" {
  project = var.project_id
  name    = "${local.name_prefix}-frontend-ip"
}

# --- HTTPS (requiere dominio propio apuntando a la IP reservada) ---

resource "google_compute_managed_ssl_certificate" "frontend" {
  count   = var.enable_https ? 1 : 0
  project = var.project_id
  name    = "${local.name_prefix}-frontend-cert"

  managed {
    domains = [var.domain_name]
  }
}

resource "google_compute_target_https_proxy" "frontend" {
  count            = var.enable_https ? 1 : 0
  project          = var.project_id
  name             = "${local.name_prefix}-https-proxy"
  url_map          = google_compute_url_map.frontend.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend[0].id]
}

resource "google_compute_global_forwarding_rule" "https" {
  count                 = var.enable_https ? 1 : 0
  project               = var.project_id
  name                  = "${local.name_prefix}-https-rule"
  ip_address            = google_compute_global_address.frontend.address
  port_range            = "443"
  target                = google_compute_target_https_proxy.frontend[0].self_link
  load_balancing_scheme = "EXTERNAL"
}

# --- HTTP: redirige a HTTPS cuando está habilitado, sirve directo si no ---

resource "google_compute_url_map" "http_redirect" {
  count   = var.enable_https ? 1 : 0
  project = var.project_id
  name    = "${local.name_prefix}-http-redirect"

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "frontend" {
  project = var.project_id
  name    = "${local.name_prefix}-http-proxy"
  url_map = var.enable_https ? google_compute_url_map.http_redirect[0].self_link : google_compute_url_map.frontend.self_link
}

resource "google_compute_global_forwarding_rule" "http" {
  project               = var.project_id
  name                  = "${local.name_prefix}-http-rule"
  ip_address            = google_compute_global_address.frontend.address
  port_range            = "80"
  target                = google_compute_target_http_proxy.frontend.self_link
  load_balancing_scheme = "EXTERNAL"
}
