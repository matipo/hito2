output "cluster_name" {
  description = "Nombre del cluster ECS"
  value       = aws_ecs_cluster.cluster.name
}
