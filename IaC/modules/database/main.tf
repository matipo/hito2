resource "aws_dynamodb_table" "app" {
  name         = "${var.project_name}-data"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-dynamodb"
    Environment = var.environment
    Project     = var.project_name
  }
}
