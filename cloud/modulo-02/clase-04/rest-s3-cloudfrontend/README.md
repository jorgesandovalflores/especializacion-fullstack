# Backend NestJS - AWS S3 Integration

## Descripción

Backend desarrollado en NestJS para la gestión de archivos en Amazon S3, diseñado para funcionar en una infraestructura AWS con EC2, VPC Endpoint y S3 en la misma red.

## Características

- ✅ Subida de archivos individuales y múltiples
- ✅ URLs pre-firmadas para upload/download
- ✅ Listado y eliminación de archivos
- ✅ Integración con IAM Roles de EC2
- ✅ Configuración CORS personalizable
- ✅ Conexión segura via VPC Endpoint

## Stack Tecnológico

- **Framework:** NestJS
- **Package Manager:** pnpm
- **Cloud:** AWS (EC2, S3, IAM, VPC)
- **Storage:** Amazon S3
- **Autenticación:** IAM Roles
- **Lenguaje:** TypeScript

## Infraestructura AWS

Este backend está diseñado para la siguiente infraestructura CloudFormation:

- **VPC:** 10.0.0.0/16
- **EC2:** Amazon Linux 2023 con IAM Role
- **S3 Bucket:** `curso-s3-ec2-905418316214-us-east-1`
- **Conectividad:** VPC Gateway Endpoint para S3
- **Seguridad:** Security Groups configurados

## Configuración Rápida

### Variables de Entorno

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=curso-s3-ec2-905418316214-us-east-1
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://test-s3.usmp.identity.pe
PORT=3000
```

### Instalación y Ejecución

```env
# Instalar dependencias
pnpm install

# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```

## API Endpoints

### Archivos

| **Método** | **Endpoint**               | **Descripción**                    |
| ---------- | -------------------------- | ---------------------------------- |
| `POST`     | `/s3/upload`               | Subir un archivo individual        |
| `POST`     | `/s3/upload-multiple`      | Subir múltiples archivos (max 10)  |
| `GET`      | `/s3/files`                | Listar archivos en el bucket       |
| `GET`      | `/s3/files/:key`           | Obtener URL temporal de un archivo |
| `DELETE`   | `/s3/files/:key`           | Eliminar un archivo                |
| `GET`      | `/s3/presigned-url`        | Generar URL firmada para descarga  |
| `GET`      | `/s3/upload-presigned-url` | Generar URL firmada para upload    |

## Ejemplos de Uso

- Subir archivo individual

    ```
    curl -X POST \
      http://34.229.216.213:3000/s3/upload \
      -F "file=@documento.pdf" \
      -F "folder=documents"
    ```

- Subir múltiples archivos

    ```
    curl -X POST \
      http://34.229.216.213:3000/s3/upload-multiple \
      -F "files=@image1.jpg" \
      -F "files=@image2.jpg" \
      -F "folder=images"
    ```

- Generar URL de descarga

    ```
    curl "http://34.229.216.213:3000/s3/presigned-url?key=documents/123456789-documento.pdf&expiresIn=3600"
    ```

- Listar archivos

    ```
    curl "http://34.229.216.213:3000/s3/files?prefix=documents/"
    ```

- Eliminar archivo

    ```
    curl -X DELETE \
      "http://34.229.216.213:3000/s3/files/documents/123456789-documento.pdf"
    ```

## Estructura del Proyecto

    ```
    src/
      ├── s3/
      │   ├── s3.controller.ts
      │   ├── s3.service.ts
      │   ├── s3.module.ts
      │   └── interfaces/
      │       └── file-upload.interface.ts
      ├── app.module.ts
      └── main.ts
    ```
