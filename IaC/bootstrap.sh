#!/bin/bash
# Crea el bucket S3 y la tabla DynamoDB para el backend remoto de Terraform.
#
# El bucket S3 debe tener un nombre GLOBALMENTE ÚNICO.
# Uso: ./bootstrap.sh taller-icinf-2025-jperez
#
set -e

if [ -z "$1" ]; then
  echo "Error: Debes proporcionar un nombre único para el bucket S3."
  echo "Uso: $0 <nombre-bucket-unico>"
  echo "Ejemplo: $0 taller-icinf-2025-jperez"
  exit 1
fi

BUCKET="$1"
TABLE="${2:-terraform-state-lock}"
REGION="${3:-us-east-1}"

echo "Creando bucket S3: ${BUCKET}"
aws s3api create-bucket --bucket "${BUCKET}" --region "${REGION}" 2>/dev/null || echo "  Bucket ya existe"
aws s3api put-bucket-versioning --bucket "${BUCKET}" --versioning-configuration Status=Enabled

echo "Creando tabla DynamoDB: ${TABLE}"
aws dynamodb create-table \
    --table-name "${TABLE}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${REGION}" 2>/dev/null || echo "  Tabla ya existe"

echo ""
echo "Bootstrap completado."
echo "Ejecuta el siguiente comando para inicializar Terraform:"
echo "  terraform init -backend-config=\"bucket=${BUCKET}\""
