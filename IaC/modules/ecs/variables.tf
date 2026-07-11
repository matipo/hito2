variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo en los recursos"
  type        = string
}

variable "desired_count" {
  description = "Cantidad deseada de tareas ECS en ejecución"
  type        = number
}

variable "subnet1_id" {
  description = "ID de la subred pública 1 para las tareas ECS"
  type        = string
}

variable "subnet2_id" {
  description = "ID de la subred pública 2 para las tareas ECS"
  type        = string
}

variable "security_group_id" {
  description = "ID del Security Group para las tareas ECS"
  type        = string
}

variable "target_group_arn" {
  description = "ARN del Target Group del ALB para enrutar tráfico"
  type        = string
}

variable "repository_url" {
  description = "URL del repositorio ECR con la imagen del contenedor"
  type        = string
}

variable "repository_arn" {
  description = "ARN del repositorio ECR para permisos de pull"
  type        = string
}

variable "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB para permisos de la aplicación"
  type        = string
}

variable "api_endpoint" {
  description = "URL del endpoint de la API Gateway para el frontend"
  type        = string
}
