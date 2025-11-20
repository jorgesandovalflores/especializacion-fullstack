#!/bin/bash

set -e

PROJECT_NAME="app-evently"
ENVIRONMENT="dev"
REGION="us-east-1"
BACKEND_TAG="0.0.1"
WEB_TAG="0.0.1"
ARN_ACM_API="arn:aws:acm:us-east-1:905418316214:certificate/4765af44-542b-42d3-a75f-3199e57669d7"

# Obtener el directorio base del proyecto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/../templates"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para verificar si un stack existe
stack_exists() {
    local stack_name=$1
    aws cloudformation describe-stacks --stack-name $stack_name --region $REGION &>/dev/null
    return $?
}

# Función para verificar y eliminar stack si existe (AHORA INCLUYE NETWORK)
check_and_delete_stack() {
    local stack_name=$1
    
    echo -e "${YELLOW}Checking stack: $stack_name${NC}"
    
    # Verificar si el stack existe
    if stack_exists "$stack_name"; then
        echo -e "${YELLOW}Stack $stack_name exists, deleting...${NC}"
        
        # Eliminar el stack
        aws cloudformation delete-stack --stack-name $stack_name --region $REGION
        
        # Esperar a que se elimine completamente
        echo -e "${YELLOW}Waiting for stack $stack_name to be deleted...${NC}"
        aws cloudformation wait stack-delete-complete \
            --stack-name $stack_name \
            --region $REGION
            
        echo -e "${GREEN}Stack $stack_name deleted successfully${NC}"
        sleep 10  # Pequeña pausa adicional
    else
        echo -e "${GREEN}Stack $stack_name does not exist, proceeding with creation${NC}"
    fi
}

# Función para eliminar TODOS los stacks en orden inverso
delete_all_stacks() {
    echo -e "${YELLOW}Deleting ALL stacks...${NC}"
    
    # Lista de stacks en orden inverso de dependencia
    local stacks=(
        "${PROJECT_NAME}-frontend-${ENVIRONMENT}"
        "${PROJECT_NAME}-backend-${ENVIRONMENT}"
        "${PROJECT_NAME}-cache-${ENVIRONMENT}"
        "${PROJECT_NAME}-database-${ENVIRONMENT}"
        "${PROJECT_NAME}-network-${ENVIRONMENT}"
    )
    
    for stack in "${stacks[@]}"; do
        if stack_exists "$stack"; then
            echo -e "${YELLOW}Deleting stack: $stack${NC}"
            aws cloudformation delete-stack --stack-name $stack --region $REGION
            
            # Esperar eliminación
            echo -e "${YELLOW}Waiting for $stack to be deleted...${NC}"
            aws cloudformation wait stack-delete-complete --stack-name $stack --region $REGION || true
            echo -e "${GREEN}Deleted: $stack${NC}"
            sleep 10
        else
            echo -e "${GREEN}Stack $stack does not exist${NC}"
        fi
    done
    
    echo -e "${GREEN}All stacks deleted successfully${NC}"
}

# Función para esperar a que un stack esté completo
wait_for_stack() {
    local stack_name=$1
    echo -e "${YELLOW}Waiting for stack $stack_name to be completely ready...${NC}"
    
    # Esperar a que el stack esté en estado CREATE_COMPLETE o UPDATE_COMPLETE
    aws cloudformation wait stack-create-complete \
        --stack-name $stack_name \
        --region $REGION 2>/dev/null || \
    aws cloudformation wait stack-update-complete \
        --stack-name $stack_name \
        --region $REGION 2>/dev/null || true
    
    echo -e "${GREEN}Stack $stack_name is ready${NC}"
}

echo -e "${YELLOW}Starting complete deployment process...${NC}"
echo -e "${YELLOW}Script directory: $SCRIPT_DIR${NC}"
echo -e "${YELLOW}Project root: $PROJECT_ROOT${NC}"
echo -e "${YELLOW}Templates directory: $TEMPLATES_DIR${NC}"

# Verificar que los templates existen
echo -e "${YELLOW}Checking template files...${NC}"
for template in network database cache backend frontend; do
    if [ ! -f "$TEMPLATES_DIR/${template}.yaml" ]; then
        echo -e "${RED}Error: Template not found: $TEMPLATES_DIR/${template}.yaml${NC}"
        exit 1
    else
        echo -e "${GREEN}Found: ${template}.yaml${NC}"
    fi
done

# Verificar que AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI no está configurado. Ejecuta 'aws configure' primero.${NC}"
    exit 1
fi

# OPCIÓN: Preguntar si eliminar todo primero
echo -e "${YELLOW}Do you want to delete ALL stacks including network before deployment? (y/N)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    delete_all_stacks
    echo -e "${YELLOW}All stacks deleted. Starting fresh deployment...${NC}"
fi

# Paso 1: Build and push images
echo -e "${YELLOW}Step 1: Building and pushing Docker images...${NC}"
cd "$SCRIPT_DIR"
./build-and-push.sh

# Paso 2: Deploy network stack (AHORA siempre se recrea si se eligió eliminar)
echo -e "${YELLOW}Step 2: Deploying network stack...${NC}"
aws cloudformation deploy \
    --template-file "$TEMPLATES_DIR/network.yaml" \
    --stack-name ${PROJECT_NAME}-network-${ENVIRONMENT} \
    --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        Environment=${ENVIRONMENT} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
wait_for_stack "${PROJECT_NAME}-network-${ENVIRONMENT}"

# Paso 3: Deploy database
echo -e "${YELLOW}Step 3: Deploying database...${NC}"
aws cloudformation deploy \
    --template-file "$TEMPLATES_DIR/database.yaml" \
    --stack-name ${PROJECT_NAME}-database-${ENVIRONMENT} \
    --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        Environment=${ENVIRONMENT} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
wait_for_stack "${PROJECT_NAME}-database-${ENVIRONMENT}"

# Esperar a que MySQL esté listo
echo -e "${YELLOW}Waiting for MySQL to be ready (90 seconds)...${NC}"
sleep 90

# Paso 4: Deploy Redis
echo -e "${YELLOW}Step 4: Deploying Redis...${NC}"
aws cloudformation deploy \
    --template-file "$TEMPLATES_DIR/cache.yaml" \
    --stack-name ${PROJECT_NAME}-cache-${ENVIRONMENT} \
    --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        Environment=${ENVIRONMENT} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
wait_for_stack "${PROJECT_NAME}-cache-${ENVIRONMENT}"

echo -e "${YELLOW}Waiting for Redis to be ready (30 seconds)...${NC}"
sleep 30

# Paso 5: Deploy backend
echo -e "${YELLOW}Step 5: Deploying backend...${NC}"
aws cloudformation deploy \
    --template-file "$TEMPLATES_DIR/backend.yaml" \
    --stack-name ${PROJECT_NAME}-backend-${ENVIRONMENT} \
    --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        Environment=${ENVIRONMENT} \
        BackendTag=${BACKEND_TAG} \
        CertificateArn=${ARN_ACM_API} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
wait_for_stack "${PROJECT_NAME}-backend-${ENVIRONMENT}"

# Esperar a que backend esté listo
echo -e "${YELLOW}Waiting for backend to be ready (60 seconds)...${NC}"
sleep 60

# Paso 6: Deploy frontend
echo -e "${YELLOW}Step 6: Deploying frontend...${NC}"
aws cloudformation deploy \
    --template-file "$TEMPLATES_DIR/frontend.yaml" \
    --stack-name ${PROJECT_NAME}-frontend-${ENVIRONMENT} \
    --parameter-overrides \
        ProjectName=${PROJECT_NAME} \
        Environment=${ENVIRONMENT} \
        WebTag=${WEB_TAG} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
wait_for_stack "${PROJECT_NAME}-frontend-${ENVIRONMENT}"

echo -e "${GREEN}Deployment completed successfully!${NC}"

# Get the application URL
echo -e "${YELLOW}Getting application URL...${NC}"
WEB_URL=$(aws cloudformation describe-stacks \
    --stack-name ${PROJECT_NAME}-frontend-${ENVIRONMENT} \
    --query 'Stacks[0].Outputs[?OutputKey==`WebURL`].OutputValue' \
    --output text \
    --region ${REGION})

if [ -n "$WEB_URL" ] && [ "$WEB_URL" != "None" ]; then
    echo -e "${GREEN}Your application is available at: http://${WEB_URL}${NC}"
else
    echo -e "${YELLOW}Web URL not available yet. Check CloudFormation outputs later.${NC}"
fi

echo -e "${YELLOW}Note: It may take a few minutes for the ALB to become fully available.${NC}"