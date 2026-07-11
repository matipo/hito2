output "vpc_id" {
  description = "ID de la VPC"
  value       = aws_vpc.main.id
}

output "subnet1_id" {
  description = "ID de la subred pública 1"
  value       = aws_subnet.public_1.id
}

output "subnet2_id" {
  description = "ID de la subred pública 2"
  value       = aws_subnet.public_2.id
}

output "alb_security_group_id" {
  description = "ID del Security Group del ALB"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "ID del Security Group de las tareas ECS"
  value       = aws_security_group.ecs.id
}