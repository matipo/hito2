output "alb_dns" {
  description = "DNS del Application Load Balancer"
  value       = aws_lb.alb.dns_name
}

output "target_group_arn" {
  description = "ARN del Target Group"
  value       = aws_lb_target_group.tg.arn
  sensitive   = true
}

output "cloudfront_domain" {
  description = "Dominio de CloudFront (HTTPS)"
  value       = aws_cloudfront_distribution.cdn.domain_name
}
