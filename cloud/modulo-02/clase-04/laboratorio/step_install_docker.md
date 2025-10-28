# Paso 1: Conectarse a la instancia EC2

```
ssh -i tu-key.pem ec2-user@tu-ip-publica
```

# Paso 2: Actualizar el sistema e instalar Docker

```
sudo dnf update -y
sudo dnf install -y docker
```

# Paso 3: Iniciar y habilitar Docker

```
sudo systemctl start docker
sudo systemctl enable docker
```

# Paso 4: Agregar usuario al grupo docker

```
sudo usermod -a -G docker ec2-user
```

# Paso 5: Instalar Docker Compose

```
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

# Paso 6: Reconectar para aplicar cambios de grupo

```
ssh -i tu-key.pem ec2-user@tu-ip-publica
```

# Paso 7: Verificar instalación

```
docker --version
docker-compose --version
```

# Paso 8: Instalación de rest-s3

```
# Pull de tu imagen
docker pull usmpandescloud/rest-s3:latest

# Ejecutar el contenedor
docker run -d \
  --name rest-s3-backend \
  -p 3000:3000 \
  -e AWS_S3_BUCKET_NAME="curso-s3-ec2-905418316214-us-east-1" \
  -e ALLOWED_ORIGINS="http://13.220.95.204:3000,http://localhost:3000" \
  usmpandescloud/rest-s3:latest
```
