variable "project_name" {
  description = "Nombre del proyecto, usado como prefijo en todos los recursos"
  type        = string
}

variable "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB donde la Lambda escribirá"
  type        = string
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}
