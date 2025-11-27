# Módulo 04 · Sesión 03 — Integración y Automatización con CI/CD

## Integración y automatización con CI/CD en AWS

---

## Objetivos de la sesión

Al finalizar esta sesión, el estudiante será capaz de:

1. Explicar el rol de **CI/CD** en aplicaciones productivas y su relación con la arquitectura en AWS.
2. Diseñar y configurar **workflows de GitHub Actions** para construir, probar y empaquetar aplicaciones.
3. Integrar repositorios de código con **AWS CodePipeline y CodeBuild** para automatizar despliegues.
4. Implementar **automatización de pruebas y despliegues** con controles de calidad (branch, approvals, tests).
5. Configurar **monitorización y alertas** sobre pipelines de CI/CD usando las herramientas de AWS.

---

## Contenido

1. Uso de GitHub Actions para despliegues
2. Integración con CodePipeline y CodeBuild
3. Automatización de pruebas y despliegue
4. Monitorización de pipelines

---

# 0) Contexto: CI/CD dentro de AWS

Antes de entrar a las herramientas, ubicamos el contexto:

-   **CI (Integración Continua)**: todo cambio de código dispara automáticamente:
    -   Construcción (build)
    -   Ejecución de pruebas (unitarias, integración)
    -   Análisis estático (lint, Sonar, etc.)
-   **CD (Entrega/Despliegue Continuo)**: si la integración es exitosa, el sistema:
    -   Empaqueta artefactos (Docker image, .zip, .jar, etc.)
    -   Despliega a entornos (dev, qas, prod) de forma automática o semiautomática.

En AWS, una arquitectura típica combina:

-   **GitHub** como repositorio de código.
-   **GitHub Actions** para CI (build + tests).
-   **AWS CodePipeline + CodeBuild + CodeDeploy/ECS/Beanstalk/Lambda** para CD.

---

# 1) Uso de GitHub Actions para despliegues

## 1.1 ¿Qué es GitHub Actions?

GitHub Actions es el sistema de **workflows** de GitHub que permite automatizar tareas basadas en eventos, por ejemplo:

-   `push` a una rama (`main`, `develop`, etc.).
-   `pull_request` para revisar cambios.
-   Tags (`v1.0.0`) para releases.

Conceptos clave:

-   **Workflow**: archivo `.yml` dentro de `.github/workflows`.
-   **Job**: conjunto de pasos que se ejecutan en un runner.
-   **Step**: paso individual (checkout, setup Node.js, run tests, etc.).
-   **Runner**: máquina donde se ejecuta el job (ej. `ubuntu-latest`).
-   **Secrets**: variables seguras (tokens, llaves de AWS, etc.).

## 1.2 Workflow básico de CI (build + tests)

Ejemplo: API Node.js que corre tests cada vez que se hace push en `main` o se abre un PR:

```yaml
# .github/workflows/ci.yml
name: CI - Build and Test

on:
    push:
        branches: ["main"]
    pull_request:
        branches: ["main"]

jobs:
    build-and-test:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: "20"

            - name: Install dependencies
              run: npm ci

            - name: Run tests
              run: npm test
```

Puntos clave para la clase:

-   Diferencia entre `npm install` y `npm ci` en entornos CI.
-   Importancia de **fallar rápido**: si las pruebas fallan, se bloquea el despliegue.

## 1.3 Uso de GitHub Actions para desplegar a AWS

Hay dos patrones muy usados:

### Patrón A: GitHub Actions hace CI y CD directamente a AWS

Ejemplo: desplegar un frontend estático a S3 + invalidar CloudFront.

```yaml
# .github/workflows/deploy-frontend.yml
name: CD - Deploy Frontend to S3

on:
    push:
        branches: ["main"]

jobs:
    deploy:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: "20"

            - name: Install & Build
              run: |
                  npm ci
                  npm run build

            - name: Configure AWS credentials (OIDC)
              uses: aws-actions/configure-aws-credentials@v4
              with:
                  role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/github-actions-deploy-role
                  aws-region: us-east-1

            - name: Sync build to S3
              run: |
                  aws s3 sync dist/ s3://mi-frontend-bucket --delete

            - name: Invalidate CloudFront
              run: |
                  aws cloudfront create-invalidation             --distribution-id ABC123DEF456             --paths "/*"
```

Ideas a remarcar:

-   Uso de **OIDC** en lugar de guardar `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` como secrets.
-   Buenas prácticas: desplegar solo desde ramas protegidas (`main`) y con PRs aprobados.

### Patrón B: GitHub Actions hace CI y dispara CodePipeline

En este patrón:

1. GitHub Actions se encarga de **tests**.
2. Si todo pasa, ejecuta `aws codepipeline start-pipeline-execution` para que AWS haga el despliegue.

Ejemplo minimal:

```yaml
- name: Trigger CodePipeline
  if: success() && github.ref == 'refs/heads/main'
  run: |
      aws codepipeline start-pipeline-execution       --name mi-pipeline-backend
```

Este patrón separa:

-   CI = GitHub Actions
-   CD = CodePipeline/CodeBuild/CodeDeploy

---

# 2) Integración con CodePipeline y CodeBuild

## 2.1 Arquitectura básica de CodePipeline

**CodePipeline** es el orquestador de etapas:

-   **Source**: GitHub, CodeCommit o S3.
-   **Build**: CodeBuild (o Jenkins, etc.).
-   **Deploy**: Elastic Beanstalk, ECS, Lambda, CloudFormation, CodeDeploy.

Cada etapa recibe artefactos y los entrega a la siguiente.

Flujo típico:

1. Developer hace push a `main` en GitHub.
2. CodePipeline (Source) recibe notificación y descarga el repo.
3. CodeBuild (Build):
    - Instala dependencias.
    - Ejecuta tests.
    - Construye artefacto (imagen Docker, .zip, etc.).
4. Etapa de Deploy:
    - Actualiza un servicio ECS, un Beanstalk Environment, un stack de CloudFormation, o una Lambda.

## 2.2 CodeBuild y buildspec.yml

**CodeBuild** es el servicio de build y test manejado por AWS.

-   Tú defines un archivo `buildspec.yml` en el repo.
-   Define fases: `install`, `pre_build`, `build`, `post_build`.

Ejemplo: construir imagen Docker y publicarla en ECR:

```yaml
version: 0.2

phases:
    install:
        commands:
            - echo "Instalando dependencias..."
            - npm ci
    pre_build:
        commands:
            - echo "Logueando en Amazon ECR..."
            - aws --version
            - $(aws ecr get-login --no-include-email --region $AWS_REGION)
            - IMAGE_TAG=${CODEBUILD_RESOLVED_SOURCE_VERSION}
    build:
        commands:
            - echo "Construyendo imagen Docker..."
            - docker build -t $ECR_REPO_NAME:$IMAGE_TAG .
            - docker tag $ECR_REPO_NAME:$IMAGE_TAG $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG
    post_build:
        commands:
            - echo "Publicando imagen en ECR..."
            - docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG

artifacts:
    files:
        - appspec.yml
        - imagedefinitions.json
```

Puntos para la clase:

-   Variables de entorno de CodeBuild: `$CODEBUILD_RESOLVED_SOURCE_VERSION`, `$AWS_REGION`, etc.
-   Artefactos que usa la siguiente etapa (ej. `imagedefinitions.json` para ECS).

## 2.3 Conectar GitHub con CodePipeline

Al crear un pipeline nuevo:

-   En **Source**, puedes elegir:
    -   `GitHub (Version 1)` o `GitHub (via CodeStar Connections)`.
-   Se crea una conexión que autoriza al pipeline a leer el repo.
-   Cada push a la rama configurada dispara el pipeline.

Comparación rápida:

-   **GitHub Actions + CodePipeline**:
    -   GitHub puede hacer los tests pesados.
    -   CodePipeline se enfoca en CD y orquestación con otros servicios AWS.
-   **Solo CodePipeline + CodeBuild**:
    -   Todo vive en AWS.
    -   Menos dependencia en herramientas externas.

---

# 3) Automatización de pruebas y despliegue

## 3.1 Dónde se ejecutan las pruebas

Opciones:

1. **GitHub Actions**:
    - Rápido para feedback al desarrollador.
    - Ideal para unit tests, linters, formateo.
2. **CodeBuild**:
    - Tests que dependen de recursos AWS (RDS, S3, colas, etc.).
    - Integración con VPC privada si se necesitan recursos internos.

Buenas prácticas:

-   Ejecutar **pruebas unitarias** siempre en CI (GitHub Actions).
-   Tener **pruebas de integración** en CodeBuild conectadas a entornos dev / qas.
-   Solo desplegar a producción si:
    -   Tests pasaron.
    -   Push proviene de rama principal.
    -   Se cumplió un **approval manual** (si lo requieres).

## 3.2 Estrategias de despliegue

En CD puedes aplicar varias estrategias (según el servicio):

-   **Rolling update** (ECS/ASG/Beanstalk):
    -   Se reemplazan instancias poco a poco.
-   **Blue/Green** (CodeDeploy + ECS/EC2):
    -   Blue = versión actual.
    -   Green = nueva versión.
    -   Una vez verificada, se cambia el tráfico al entorno Green.
-   **Canary**:
    -   Pequeño porcentaje de tráfico a la nueva versión.
    -   Si todo va bien, se aumenta hasta 100%.

Concepto importante para la clase:

-   Combinar **estrategia de despliegue** con **automatización de pruebas de smoke** post-deploy:
    -   Verificar `/health` o `/status` de la app.
    -   Revertir (rollback automático) si falla.

## 3.3 Flujo ejemplo de extremo a extremo

Un flujo típico para una API en AWS podría ser:

1. Developer hace push a `feature/x`.
2. GitHub Actions corre tests y lints para esa rama.
3. Se abre un PR a `develop` o `main`:
    - GitHub Actions vuelve a correr tests.
    - Se requiere aprobación de otro desarrollador.
4. Al mergear a `main`:
    - GitHub Actions:
        - Vuelve a correr tests.
        - Si todo pasa, llama a `start-pipeline-execution` de CodePipeline.
    - CodePipeline:
        - Source: descarga el repo de GitHub.
        - Build: CodeBuild corre pruebas de integración + build Docker.
        - Deploy: actualiza ECS/Beanstalk/ASG.
        - Health checks y, según resultado, confirma despliegue o hace rollback.

---

# 4) Monitorización de pipelines

## 4.1 Métricas y logs

Para cada componente:

-   **CodePipeline**:
    -   Estados de ejecución: `Succeeded`, `Failed`, `In Progress`.
    -   Eventos por etapa: Source, Build, Deploy.
-   **CodeBuild**:
    -   Logs en CloudWatch Logs (un grupo por proyecto).
    -   Métricas: duración de build, éxito/falla, tiempo de cola.

Lo que debes enseñar:

-   Cómo entrar a **CloudWatch Logs** para revisar un build fallido.
-   Cómo interpretar el timeline de CodePipeline para ver en qué etapa falló.

## 4.2 Alertas y notificaciones

Opciones:

-   **SNS**:
    -   Notificaciones por correo cuando un pipeline falla.
-   **AWS Chatbot**:
    -   Enviar notificaciones a Slack/Teams desde SNS o CloudWatch.
-   **CloudWatch Alarms**:
    -   Crear alarmas sobre métricas de CodePipeline / CodeBuild
    -   Ejemplo: si hay más de N fallas en 1 hora, notificar.

Ejemplo de flujo:

1. CodePipeline falla en la etapa Build.
2. Se envía un evento a CloudWatch Events / EventBridge.
3. EventBridge dispara una notificación SNS.
4. SNS envía correo al equipo o un mensaje a Slack vía Chatbot.

## 4.3 Buenas prácticas de monitorización

-   Nombrar pipelines y proyectos de build con nombres claros por entorno:
    -   `app-backend-dev-pipeline`, `app-backend-prd-pipeline`.
-   Etiquetar (tags) recursos de CI/CD:
    -   `Project=MiApp`, `Environment=Prod`, `Owner=EquipoBackend`.
-   Crear un **dashboard** en CloudWatch con:
    -   Número de ejecuciones exitosas/fallidas.
    -   Duración promedio de build.
    -   Número de despliegues por día/semana.

---

# 5) Propuesta de Demo para la sesión

Para la parte práctica de la clase, se puede plantear un caso concreto:

1. **Repositorio en GitHub** con una API Node.js o un frontend simple.
2. Crear un workflow de **GitHub Actions** que:
    - Haga `npm ci`.
    - Ejecute tests.
    - Analice el código (ej. `npm run lint`).
3. Crear un **CodePipeline** que:
    - Tome como source el mismo repo (rama `main`).
    - Use **CodeBuild** para construir una imagen Docker y publicarla en ECR.
    - Despliegue la imagen a un servicio ECS o a Elastic Beanstalk.
4. Configurar **notificaciones**:
    - SNS para reportar fallas de build.
    - Ver logs de CodeBuild en CloudWatch cuando el pipeline falle.

---

# 6) Resumen para cierre de sesión

Puntos clave que el estudiante debe llevarse:

-   CI/CD no es solo “correr scripts”, sino diseñar **flujos repetibles y confiables**.
-   GitHub Actions es una herramienta potente para CI y, si se desea, también para CD.
-   CodePipeline y CodeBuild permiten que la parte de **despliegue** viva completamente dentro de AWS.
-   Las pruebas automatizadas deben estar integradas en el pipeline, no ser un paso manual.
-   La monitorización de pipelines (logs, métricas, alertas) es tan importante como monitorizar las apps productivas.

Con esta base, los estudiantes estarán listos para implementar pipelines de CI/CD reales para sus proyectos en AWS, uniendo repositorios de código, pruebas automatizadas y despliegues controlados a entornos productivos.
