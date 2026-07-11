output "api_endpoint" {
  description = "URL del endpoint de la API Gateway"
  value       = aws_apigatewayv2_api.http.api_endpoint
}
