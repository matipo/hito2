module "network" {
  source = "./modules/network"

  project_name = var.project_name
  aws_region   = var.aws_region
  vpc_cidr     = var.vpc_cidr
  subnet1_cidr = var.subnet1_cidr
  subnet2_cidr = var.subnet2_cidr
}

module "database" {
  source = "./modules/database"

  project_name = var.project_name
  environment  = var.environment
}

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
}

module "alb" {
  source = "./modules/alb"

  project_name      = var.project_name
  vpc_id            = module.network.vpc_id
  subnet1_id        = module.network.subnet1_id
  subnet2_id        = module.network.subnet2_id
  security_group_id = module.network.alb_security_group_id
}

module "api" {
  source = "./modules/api"

  project_name        = var.project_name
  dynamodb_table_arn  = module.database.table_arn
  dynamodb_table_name = module.database.table_name
}

# Budget de costos: alerta al 80% de USD 20/mes (Clase 11)
resource "aws_budgets_budget" "monthly" {
  name         = "${var.project_name}-budget-mensual"
  budget_type  = "COST"
  limit_amount = "20"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["taller-icinf@ulagos.cl"]
  }
}

module "ecs" {
  source = "./modules/ecs"

  project_name       = var.project_name
  desired_count      = var.desired_count
  subnet1_id         = module.network.subnet1_id
  subnet2_id         = module.network.subnet2_id
  security_group_id  = module.network.ecs_security_group_id
  target_group_arn   = module.alb.target_group_arn
  repository_url     = module.ecr.repository_url
  repository_arn     = module.ecr.repository_arn
  dynamodb_table_arn = module.database.table_arn
  api_endpoint       = module.api.api_endpoint
}
