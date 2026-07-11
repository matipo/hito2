variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo en los recursos"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC donde se despliega el balanceador"
  type        = string
}

variable "subnet1_id" {
  description = "ID de la subred pública 1 para el balanceador"
  type        = string
}

variable "subnet2_id" {
  description = "ID de la subred pública 2 para el balanceador"
  type        = string
}

variable "security_group_id" {
  description = "ID del Security Group asociado al balanceador"
  type        = string
}
