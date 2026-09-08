output "function_name" {
  description = "Nombre de la función Lambda"
  value       = aws_lambda_function.api.function_name
}

output "function_arn" {
  description = "ARN de la función Lambda"
  value       = aws_lambda_function.api.arn
}

output "api_endpoint" {
  description = "URL pública de la API Gateway HTTP API"
  value       = aws_apigatewayv2_stage.default.invoke_url
}
