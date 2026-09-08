locals {
  name_prefix = "${var.project_name}-${var.environment}"
  source_dir  = var.source_dir != null ? var.source_dir : "${path.module}/function-src"
}

resource "random_id" "source_suffix" {
  byte_length = 4
}

resource "google_storage_bucket" "source" {
  project                     = var.project_id
  name                        = "${local.name_prefix}-fn-source-${random_id.source_suffix.hex}"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = true
  labels                      = var.labels
}

data "archive_file" "source" {
  type        = "zip"
  source_dir  = local.source_dir
  output_path = "${path.module}/dist/${var.environment}-source.zip"
}

resource "google_storage_bucket_object" "source" {
  name   = "source-${data.archive_file.source.output_md5}.zip"
  bucket = google_storage_bucket.source.name
  source = data.archive_file.source.output_path
}

resource "google_cloudfunctions2_function" "api" {
  project  = var.project_id
  name     = "${local.name_prefix}-api"
  location = var.region

  build_config {
    runtime     = var.runtime
    entry_point = var.entry_point

    source {
      storage_source {
        bucket = google_storage_bucket.source.name
        object = google_storage_bucket_object.source.name
      }
    }
  }

  service_config {
    max_instance_count    = var.max_instance_count
    available_memory      = var.available_memory
    timeout_seconds       = var.timeout_seconds
    environment_variables = var.environment_variables
    ingress_settings      = "ALLOW_ALL"
  }

  labels = var.labels
}

resource "google_cloud_run_service_iam_member" "public_invoker" {
  count    = var.allow_unauthenticated ? 1 : 0
  project  = var.project_id
  location = google_cloudfunctions2_function.api.location
  service  = google_cloudfunctions2_function.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
