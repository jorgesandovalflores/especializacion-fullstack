
# Comandos básicos de Docker y Docker Compose

## 🐳 Comandos básicos de **Docker**
| Comando | Descripción |
|---------|-------------|
| `docker ps` | Lista los contenedores en ejecución. |
| `docker ps -a` | Lista todos los contenedores (incluidos detenidos). |
| `docker images` | Lista todas las imágenes disponibles localmente. |
| `docker pull <imagen>` | Descarga una imagen desde Docker Hub u otro registro. |
| `docker build -t <nombre>:<tag> .` | Construye una imagen desde un Dockerfile en el directorio actual. |
| `docker run <imagen>` | Crea y ejecuta un contenedor desde una imagen. |
| `docker run -d <imagen>` | Ejecuta un contenedor en segundo plano. |
| `docker run -it <imagen> sh` | Ejecuta un contenedor y abre una shell interactiva. |
| `docker exec -it <contenedor> sh` | Ejecuta un comando o shell dentro de un contenedor en ejecución. |
| `docker logs <contenedor>` | Muestra los logs de un contenedor. |
| `docker stop <contenedor>` | Detiene un contenedor en ejecución. |
| `docker start <contenedor>` | Inicia un contenedor detenido. |
| `docker restart <contenedor>` | Reinicia un contenedor. |
| `docker rm <contenedor>` | Elimina un contenedor detenido. |
| `docker rmi <imagen>` | Elimina una imagen local. |
| `docker network ls` | Lista las redes de Docker. |
| `docker volume ls` | Lista los volúmenes de Docker. |
| `docker stats` | Muestra uso de CPU, RAM y red de los contenedores en tiempo real. |
| `docker inspect <contenedor/imagen>` | Muestra detalles en formato JSON. |
| `docker system prune` | Elimina contenedores, imágenes, redes y volúmenes sin uso. |

---

## 📦 Comandos básicos de **Docker Compose**
| Comando | Descripción |
|---------|-------------|
| `docker compose up` | Levanta todos los servicios definidos en `docker-compose.yml`. |
| `docker compose up -d` | Levanta los servicios en segundo plano. |
| `docker compose down` | Detiene y elimina todos los contenedores, redes y volúmenes creados por `up`. |
| `docker compose build` | Construye o reconstruye las imágenes de los servicios. |
| `docker compose pull` | Descarga las imágenes definidas sin ejecutarlas. |
| `docker compose push` | Sube las imágenes al registro configurado. |
| `docker compose ps` | Lista los contenedores gestionados por `docker-compose`. |
| `docker compose logs` | Muestra los logs de todos los servicios. |
| `docker compose logs -f` | Sigue los logs en tiempo real. |
| `docker compose stop` | Detiene los contenedores sin eliminarlos. |
| `docker compose start` | Inicia contenedores detenidos. |
| `docker compose restart` | Reinicia los servicios. |
| `docker compose exec <servicio> sh` | Ejecuta una shell dentro de un servicio en ejecución. |
| `docker compose run <servicio>` | Crea y ejecuta un contenedor temporal para un servicio. |
| `docker compose config` | Valida y muestra la configuración procesada del `docker-compose.yml`. |
| `docker compose rm` | Elimina contenedores detenidos definidos en el compose. |
