variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo en los recursos"
  type        = string
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}
