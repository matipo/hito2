variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
}

variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo en todos los recursos"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "Bloque CIDR para la VPC"
  type        = string
}

variable "subnet1_cidr" {
  description = "Bloque CIDR para la subred pública 1"
  type        = string
}

variable "subnet2_cidr" {
  description = "Bloque CIDR para la subred pública 2"
  type        = string
}

variable "desired_count" {
  description = "Número deseado de tareas ECS en ejecución"
  type        = number
}
