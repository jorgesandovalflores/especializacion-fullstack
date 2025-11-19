#!/bin/bash

set -e

# Variables
PROJECT_NAME="app-evently"
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
BACKEND_IMAGE="http-app-evently"
WEB_IMAGE="web-app-evently"
BACKEND_TAG="0.0.1"
WEB_TAG="0.0.1"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Building and pushing Docker images...${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -d "../../backend-evently" ] || [ ! -d "../../web-evently" ]; then
    echo -e "${RED}Error: No se encuentran los directorios backend-evently y web-evently${NC}"
    echo "Ejecuta desde: cloudformation/scripts/"
    exit 1
fi

# Configurar buildx para mejor rendimiento
echo -e "${YELLOW}Setting up Docker buildx...${NC}"
docker buildx create --name mybuilder --use 2>/dev/null || true
docker buildx inspect --bootstrap

# Login to ECR
echo -e "${YELLOW}Logging into ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repositories
echo -e "${YELLOW}Creating ECR repositories...${NC}"
aws ecr create-repository --repository-name $BACKEND_IMAGE --region $AWS_REGION --image-scanning-configuration scanOnPush=true 2>/dev/null || echo "Backend repository already exists"
aws ecr create-repository --repository-name $WEB_IMAGE --region $AWS_REGION --image-scanning-configuration scanOnPush=true 2>/dev/null || echo "Web repository already exists"

# Build and push backend FOR AMD64 using buildx
echo -e "${YELLOW}Building backend image for linux/amd64 with buildx...${NC}"
cd ../../backend-evently
docker buildx build --platform linux/amd64 --load -t $BACKEND_IMAGE:$BACKEND_TAG .
docker tag $BACKEND_IMAGE:$BACKEND_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_IMAGE:$BACKEND_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_IMAGE:$BACKEND_TAG

# Build and push frontend FOR AMD64 using buildx
echo -e "${YELLOW}Building frontend image for linux/amd64 with buildx...${NC}"
cd ../web-evently
docker buildx build --platform linux/amd64 --load -t $WEB_IMAGE:$WEB_TAG .
docker tag $WEB_IMAGE:$WEB_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$WEB_IMAGE:$WEB_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$WEB_IMAGE:$WEB_TAG

# Volver al directorio original
cd ../cloudformation/scripts

echo -e "${GREEN}Images pushed successfully!${NC}"
echo -e "${GREEN}Backend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_IMAGE:$BACKEND_TAG${NC}"
echo -e "${GREEN}Frontend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$WEB_IMAGE:$WEB_TAG${NC}"