output "alb_dns" {
  description = "DNS del Application Load Balancer (HTTP directo, solo accesible desde CloudFront)"
  value       = module.alb.alb_dns
}

output "cloudfront_url" {
  description = "URL HTTPS de CloudFront (usar esta para acceder a la aplicación)"
  value       = "https://${module.alb.cloudfront_domain}"
}

output "vpc_id" {
  description = "ID de la VPC"
  value       = module.network.vpc_id
}

output "cluster_name" {
  description = "Nombre del cluster ECS"
  value       = module.ecs.cluster_name
}

output "repository_url" {
  description = "URL del repositorio ECR"
  value       = module.ecr.repository_url
  sensitive   = true
}

output "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB de la aplicación"
  value       = module.database.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla DynamoDB de la aplicación"
  value       = module.database.table_arn
  sensitive   = true
}

output "api_endpoint" {
  description = "URL del endpoint de la API Gateway para el checkout"
  value       = module.api.api_endpoint
}
