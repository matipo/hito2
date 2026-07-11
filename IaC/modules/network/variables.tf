variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo en los recursos"
  type        = string
}

variable "aws_region" {
  description = "Región de AWS donde se despliegan los recursos"
  type        = string
}

variable "vpc_cidr" {
  description = "Bloque CIDR para la VPC (ej. 10.0.0.0/16)"
  type        = string
}

variable "subnet1_cidr" {
  description = "Bloque CIDR para la subred pública 1 (ej. 10.0.1.0/24)"
  type        = string
}

variable "subnet2_cidr" {
  description = "Bloque CIDR para la subred pública 2 (ej. 10.0.2.0/24)"
  type        = string
}

