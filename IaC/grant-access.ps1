<#
.SYNOPSIS
  Genera nuevas access keys para el usuario IAM de solo lectura y las sube a S3.

.DESCRIPTION
  Crea un par de access keys para el usuario taller (solo lectura),
  las guarda como JSON en el bucket S3 del backend e imprime instrucciones
  para que el docente las configure en su CLI.

.USAGE
  .\grant-access.ps1 taller-icinf-2026-matipo

.PARAMETER BucketName
  Nombre del bucket S3 donde se suben las credenciales.

.PARAMETER UserName
  Nombre del usuario IAM (default: taller).

.PARAMETER Profile
  Perfil de AWS CLI con permisos de administrador (default: adminmatipo).

.PARAMETER Region
  Región de AWS (default: us-east-1).
#>
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$BucketName,
    [string]$UserName = "taller",
    [string]$Profile = "adminmatipo",
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"
$S3Key = "credentials/reviewer-access.json"

Write-Host "`n=== Generando credenciales para el docente ===" -ForegroundColor Cyan

# --- 1. Verificar que el usuario existe ---
Write-Host "`n[1/4] Verificando usuario IAM..." -ForegroundColor Yellow

$Arn = aws iam get-user --user-name $UserName --profile $Profile --region $Region --query 'User.Arn' --output text 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "  El usuario '$UserName' no existe" -ForegroundColor Red
    exit 1
}

Write-Host "  Usuario: $Arn" -ForegroundColor Green

# --- 2. Crear nuevas access keys ---
Write-Host "`n[2/4] Creando nuevas access keys..." -ForegroundColor Yellow

$KeyData = aws iam create-access-key --user-name $UserName --profile $Profile --region $Region --output json

if ($LASTEXITCODE -ne 0) {
    Write-Host "  Error al crear access keys" -ForegroundColor Red
    exit 1
}

$KeyJson = $KeyData | ConvertFrom-Json
$AccessKeyId = $KeyJson.AccessKey.AccessKeyId
$SecretKey = $KeyJson.AccessKey.SecretAccessKey
$Created = $KeyJson.AccessKey.CreateDate

Write-Host "  AccessKeyId: $AccessKeyId" -ForegroundColor Green

# --- 3. Armar JSON con instrucciones ---
Write-Host "`n[3/4] Empaquetando credenciales..." -ForegroundColor Yellow

$Output = @{
    Version     = 1
    CreatedAt   = $Created
    Region      = $Region
    Credentials = @{
        AccessKeyId     = $AccessKeyId
        SecretAccessKey = $SecretKey
    }
    Instructions = @(
        "1. Ejecutar: aws configure"
        "2. Pegar Access Key ID: $AccessKeyId"
        "3. Pegar Secret Access Key (se muestra una sola vez)"
        "4. Region: $Region"
        "5. Formato de salida: json"
        "6. Verificar con: aws sts get-caller-identity"
    )
} | ConvertTo-Json -Depth 4

$TmpFile = "credentials.json"
$Output | Out-File -Encoding utf8 $TmpFile

# --- 4. Subir a S3 ---
Write-Host "`n[4/4] Subiendo credenciales a s3://$BucketName/$S3Key ..." -ForegroundColor Yellow

aws s3 cp $TmpFile "s3://$BucketName/$S3Key" --profile $Profile --region $Region --quiet

Remove-Item $TmpFile -Force

# --- Resumen ---
Write-Host "`n=== Listo ===" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciales subidas a:" -ForegroundColor Cyan
Write-Host "  s3://$BucketName/$S3Key" -ForegroundColor White
Write-Host ""
Write-Host "El docente debe ejecutar:" -ForegroundColor Cyan
Write-Host "  aws s3 cp s3://$BucketName/$S3Key credentials.json" -ForegroundColor White
Write-Host "  aws configure  (y pegar los valores del JSON)" -ForegroundColor White
Write-Host "  aws sts get-caller-identity  (para verificar)" -ForegroundColor White
Write-Host ""
Write-Host "NOTA: El SecretAccessKey solo se muestra una vez." -ForegroundColor Yellow
Write-Host "      Guardalo ahora si necesitas usarlo despues." -ForegroundColor Yellow
Write-Host ""
