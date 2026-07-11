locals {
  function_name = "${var.project_name}-checkout"
}

# Rol IAM que Lambda asume al ejecutarse
resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-lambda-checkout-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name    = "${var.project_name}-lambda-checkout-role"
    Project = var.project_name
  }
}

# Permitir logs en CloudWatch
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Permiso acotado para escribir en DynamoDB
resource "aws_iam_policy" "lambda_dynamodb" {
  name        = "${var.project_name}-lambda-dynamodb-policy"
  description = "Permite a la Lambda escribir en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = var.dynamodb_table_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.lambda_dynamodb.arn
}

# Empaquetar el código de la Lambda
data "archive_file" "lambda" {
  type        = "zip"
  output_path = "${path.module}/../../lambda/checkout.zip"
  source_file = "${path.module}/../../lambda/checkout.py"
}

# Lambda function
resource "aws_lambda_function" "checkout" {
  filename         = data.archive_file.lambda.output_path
  function_name    = local.function_name
  role             = aws_iam_role.lambda.arn
  handler          = "checkout.lambda_handler"
  runtime          = "python3.12"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  timeout          = 10

  environment {
    variables = {
      TABLE_NAME = var.dynamodb_table_name
    }
  }

  tags = {
    Name    = local.function_name
    Project = var.project_name
  }
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "http" {
  name          = "${var.project_name}-checkout-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
  }

  tags = {
    Name    = "${var.project_name}-checkout-api"
    Project = var.project_name
  }
}

# Integración Lambda → API Gateway
resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.checkout.invoke_arn
  payload_format_version = "2.0"
}

# Ruta POST /checkout
resource "aws_apigatewayv2_route" "checkout" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /checkout"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Despliegue de la API (stage $default)
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

# Permiso para que API Gateway invoque la Lambda
resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.checkout.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*/checkout"
}
