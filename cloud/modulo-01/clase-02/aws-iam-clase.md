# Clase: AWS IAM (Identity and Access Management)

## 1. ¿Qué es IAM?
- **IAM (Identity and Access Management)** es el servicio de AWS para **administrar identidades (usuarios, grupos, roles)** y **controlar el acceso a recursos**.  
- Permite definir **quién** puede acceder y **qué** puede hacer dentro de la cuenta de AWS.  
- Se basa en el concepto de **políticas JSON**, que determinan permisos sobre recursos.  

### Importancia
- Seguridad: evitar accesos no autorizados.  
- Escalabilidad: manejar múltiples usuarios y aplicaciones.  
- Auditoría: saber quién hizo qué, y cuándo.  

---

## 2. Conceptos principales
### a. Usuarios
- Identidad individual con credenciales propias (usuario y contraseña, o access keys).  
- Ejemplo: `juan_dev` que necesita acceso a S3 para desarrollo.  

### b. Grupos
- Colecciones lógicas de usuarios.  
- Los permisos se asignan al grupo, y los usuarios los heredan.  
- Ejemplo: `Grupo-Desarrolladores` con permisos de lectura en S3.  

### c. Roles
- Identidades “asumibles” por usuarios o servicios, con permisos temporales.  
- No tienen credenciales permanentes.  
- Ejemplo: un rol que permite a una instancia EC2 leer de un bucket S3.  

### d. Políticas (Policies)
- Documentos en JSON que describen permisos.  
- **Principio de mínimo privilegio**: otorgar solo los permisos estrictamente necesarios.  

---

## 3 Estructura detallada de una política JSON en IAM

Una política en IAM se define en un documento JSON con una estructura estándar.  

### Campos principales

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "IdentificadorOpcional",
      "Effect": "Allow" | "Deny",
      "Action": "servicio:operacion" | ["servicio:operacion1","servicio:operacion2"],
      "NotAction": "servicio:operacion",
      "Resource": "arn:aws:servicio:region:cuenta:recurso" | ["..."],
      "NotResource": "...",
      "Condition": {
        "condicion": {
          "clave": "valor"
        }
      }
    }
  ]
}
```

### Explicación de cada campo

- **Version**: define el esquema del documento. El valor recomendado es `"2012-10-17"`, la última versión estable.  
- **Statement**: bloque principal que contiene una o varias reglas de permiso/denegación.  

Dentro de cada `Statement`:  
- **Sid** (*Statement ID*): opcional, un identificador único para distinguir reglas.  
- **Effect**: determina si la regla permite (`Allow`) o deniega (`Deny`).  
- **Action**: lista de acciones específicas de un servicio que se permiten o deniegan. Ejemplo: `s3:PutObject`, `ec2:StartInstances`.  
- **NotAction**: opuesto a `Action`. Permite o deniega **todas las acciones excepto** las listadas.  
- **Resource**: define el recurso sobre el que aplica la acción, expresado como **ARN (Amazon Resource Name)**. Puede ser un recurso específico o `"*"` (todos).  
- **NotResource**: opuesto a `Resource`. Aplica la acción a todos los recursos **excepto** los listados.  
- **Condition**: bloque opcional que aplica condiciones adicionales.  

### Condiciones comunes (`Condition`)

Las condiciones se estructuran como:

```json
"Condition": {
  "StringEquals": {
    "aws:username": "juan_dev"
  },
  "IpAddress": {
    "aws:SourceIp": "192.168.1.0/24"
  },
  "Bool": {
    "aws:MultiFactorAuthPresent": "true"
  }
}
```

Tipos de condición más usados:
- **StringEquals / StringNotEquals**: comparaciones exactas de cadenas.  
- **StringLike / StringNotLike**: patrones con comodines.  
- **IpAddress / NotIpAddress**: restringir por rango de IP.  
- **DateGreaterThan / DateLessThan**: restricciones temporales.  
- **Bool**: valores booleanos, por ejemplo para MFA (`true/false`).  

---

## 4. Ejemplo práctico de Políticas
### a. Acceso **Full a AWS** (Administrador total)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```
Esta política otorga acceso **total** a todos los servicios y recursos de AWS (equivalente a `AdministratorAccess`).  
**Se debe usar solo para administradores.**  

### b. Acceso **Full a un recurso específico** (ejemplo: bucket S3)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::mi-bucket",
        "arn:aws:s3:::mi-bucket/*"
      ]
    }
  ]
}
```
Permite **todas las operaciones** (crear, leer, escribir, borrar) únicamente sobre el bucket `mi-bucket` y sus objetos.  

### c. Acceso **limitado a un recurso** (solo lectura en un bucket)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mi-bucket",
        "arn:aws:s3:::mi-bucket/*"
      ]
    }
  ]
}
```
Permite **listar y leer objetos** en `mi-bucket`, pero no permite escribir ni borrar.  

---
