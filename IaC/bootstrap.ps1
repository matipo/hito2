<#
.SYNOPSIS
  Crea el bucket S3 y la tabla DynamoDB para el backend remoto de Terraform.

.DESCRIPTION
  El bucket S3 debe tener un nombre GLOBALMENTE ÚNICO.
  Ejemplo: ./bootstrap.ps1 taller-icinf-2025-jperez

.PARAMETER BucketName
  Nombre único global para el bucket S3. Ej: "taller-icinf-2025-jperez"

.PARAMETER DynamoDBTable
  Nombre de la tabla DynamoDB para bloqueo de estado (default: terraform-state-lock)

.PARAMETER Region
  Región AWS (default: us-east-1)
#>
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$BucketName,
    [string]$DynamoDBTable = "terraform-state-lock",
    [string]$Region = "us-east-1"
)

Write-Host "Creando bucket S3: $BucketName" -ForegroundColor Cyan
try {
    aws s3api create-bucket --bucket $BucketName --region $Region
    aws s3api put-bucket-versioning --bucket $BucketName --versioning-configuration Status=Enabled
    Write-Host "  Bucket creado exitosamente" -ForegroundColor Green
} catch {
    Write-Warning "  Error creando bucket (puede que ya exista): $_"
}

Write-Host "Creando tabla DynamoDB: $DynamoDBTable" -ForegroundColor Cyan
try {
    aws dynamodb create-table `
        --table-name $DynamoDBTable `
        --attribute-definitions AttributeName=LockID,AttributeType=S `
        --key-schema AttributeName=LockID,KeyType=HASH `
        --billing-mode PAY_PER_REQUEST `
        --region $Region
    Write-Host "  Tabla creada exitosamente" -ForegroundColor Green
} catch {
    Write-Warning "  Error creando tabla (puede que ya exista): $_"
}

Write-Host "`nBootstrap completado." -ForegroundColor Green
Write-Host "Ejecuta el siguiente comando para inicializar Terraform:" -ForegroundColor Yellow
Write-Host "  terraform init -backend-config=`"bucket=$BucketName`"" -ForegroundColor Cyan
