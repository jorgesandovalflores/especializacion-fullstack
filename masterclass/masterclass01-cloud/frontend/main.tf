provider "aws" {
    region = var.aws_region
}

# Crear un bucket S3 para almacenar los archivos de la SPA
resource "aws_s3_bucket" "spa_bucket" {
    bucket = var.bucket_name

    tags = {
        Name = "SPA Bucket"
    }
}

# Configurar el bucket como un sitio web estático
resource "aws_s3_bucket_website_configuration" "spa_bucket_website" {
    bucket = aws_s3_bucket.spa_bucket.bucket

    index_document {
        suffix = "index.html"
    }

    error_document {
        key = "index.html"
    }
}

# Configurar el control de acceso (ACL) del bucket
resource "aws_s3_bucket_acl" "spa_bucket_acl" {
    bucket = aws_s3_bucket.spa_bucket.id
    acl    = "private"  # Cambia a "public-read" si deseas que el contenido sea público
}

# Política de bucket para permitir el acceso público a los archivos (opcional, solo si el bucket es público)
resource "aws_s3_bucket_policy" "spa_bucket_policy" {
    bucket = aws_s3_bucket.spa_bucket.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Effect    = "Allow"
                Principal = "*"
                Action    = "s3:GetObject"
                Resource  = "${aws_s3_bucket.spa_bucket.arn}/*"
            }
        ]
    })
}

# Crear una distribución de CloudFront para servir la SPA
resource "aws_cloudfront_distribution" "spa_distribution" {
    origin {
        domain_name = aws_s3_bucket.spa_bucket.website_endpoint
        origin_id   = "S3-${aws_s3_bucket.spa_bucket.bucket}"

        custom_origin_config {
            http_port              = 80
            https_port             = 443
            origin_protocol_policy = "http-only"
            origin_ssl_protocols   = ["TLSv1.2"]
        }
    }

    enabled             = true
    default_root_object = "index.html"

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = "S3-${aws_s3_bucket.spa_bucket.bucket}"

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 0
        default_ttl            = 3600
        max_ttl                = 86400
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    viewer_certificate {
        cloudfront_default_certificate = true
    }

    tags = {
        Name = "SPA CloudFront Distribution"
    }
}