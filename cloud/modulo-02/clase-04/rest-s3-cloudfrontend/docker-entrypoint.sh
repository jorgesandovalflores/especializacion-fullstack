#!/bin/sh
set -e

# Valores por defecto
DEFAULT_PORT=3000
DEFAULT_AWS_REGION="us-east-1"
DEFAULT_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
DEFAULT_CLOUDFRONT_BASE_URL=""

# Usar variables de entorno o valores por defecto
export PORT=${PORT:-$DEFAULT_PORT}
export AWS_REGION=${AWS_REGION:-$DEFAULT_AWS_REGION}
export ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-$DEFAULT_ALLOWED_ORIGINS}
export CLOUDFRONT_BASE_URL=${CLOUDFRONT_BASE_URL:-$DEFAULT_CLOUDFRONT_BASE_URL}


# Validar variables requeridas
if [ -z "$AWS_S3_BUCKET_NAME" ]; then
    echo "Error: AWS_S3_BUCKET_NAME must be set"
    exit 1
fi

echo "Starting NestJS S3 Backend with configuration:"
echo "Port: $PORT"
echo "AWS Region: $AWS_REGION"
echo "S3 Bucket: $AWS_S3_BUCKET_NAME"
echo "Allowed Origins: $ALLOWED_ORIGINS"
echo "Cloudfrontend: $CLOUDFRONT_BASE_URL"

# Ejecutar la aplicación
exec node dist/main.js