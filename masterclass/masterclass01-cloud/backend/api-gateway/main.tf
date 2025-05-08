resource "aws_api_gateway_rest_api" "api" {
    name = "nodejs-api-gateway"
}

resource "aws_api_gateway_deployment" "deployment" {
    rest_api_id = aws_api_gateway_rest_api.api.id
}

output "api_url" {
    value = aws_api_gateway_deployment.deployment.invoke_url
}