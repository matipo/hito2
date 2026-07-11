output "repository_url" {
  description = "URL del repositorio ECR"
  value       = aws_ecr_repository.repo.repository_url
  sensitive   = true
}

output "repository_arn" {
  description = "ARN del repositorio ECR"
  value       = aws_ecr_repository.repo.arn
  sensitive   = true
}
