# Backend remoto para almacenar el estado de Terraform.
#
# El nombre del bucket S3 se pasa por CLI porque debe ser globalmente único
# y Terraform no permite usar variables dentro del backend.
#
# Uso:
#   terraform init -backend-config="bucket=taller-icinf-2025-tus-iniciales"

terraform {
  backend "s3" {
    key          = "null-trade/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }
}
