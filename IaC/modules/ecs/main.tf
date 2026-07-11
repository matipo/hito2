resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 30

  tags = {
    Name    = "${var.project_name}-logs"
    Project = var.project_name
  }
}

resource "aws_iam_role" "ecs_execution" {
  name = "${var.project_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name    = "${var.project_name}-ecs-execution-role"
    Project = var.project_name
  }
}

# Política acotada: solo pull de imágenes desde ECR
resource "aws_iam_policy" "ecr_pull" {
  name        = "${var.project_name}-ecr-pull-policy"
  description = "Permisos mínimos para pull de imágenes Docker desde ECR"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = var.repository_arn
      }
    ]
  })

  tags = {
    Name    = "${var.project_name}-ecr-pull-policy"
    Project = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "ecs_execution_ecr" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = aws_iam_policy.ecr_pull.arn
}

# Política acotada: solo escribir en el log group de este proyecto
resource "aws_iam_policy" "ecs_execution_logs" {
  name        = "${var.project_name}-ecs-logs-policy"
  description = "Permisos acotados para escribir logs en CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:log-group:/ecs/${var.project_name}:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_logs" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = aws_iam_policy.ecs_execution_logs.arn
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name    = "${var.project_name}-ecs-task-role"
    Project = var.project_name
  }
}

resource "aws_iam_policy" "dynamodb_access" {
  name        = "${var.project_name}-dynamodb-policy"
  description = "Permisos de lectura/escritura para DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = var.dynamodb_table_arn
      }
    ]
  })

  tags = {
    Name    = "${var.project_name}-dynamodb-policy"
    Project = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_dynamodb" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_ecs_cluster" "cluster" {
  name = "${var.project_name}-cluster"

  tags = {
    Name    = "${var.project_name}-cluster"
    Project = var.project_name
  }
}

resource "aws_ecs_task_definition" "task" {
  family                   = var.project_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "web"
      image     = var.repository_url
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "API_URL"
          value = var.api_endpoint
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = data.aws_region.current.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_region" "current" {}

resource "aws_ecs_service" "service" {
  name            = "${var.project_name}-svc"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [var.subnet1_id, var.subnet2_id]
    security_groups  = [var.security_group_id]
    assign_public_ip = true # Se mantiene para alcanzar API Gateway (servicio público sin VPC endpoint). DynamoDB y ECR ya usan VPC Endpoints.
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "web"
    container_port   = 80
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}

# Auto Scaling: Target Tracking al 60% de CPU (Clase 6)
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 4
  min_capacity       = var.desired_count
  resource_id        = "service/${aws_ecs_cluster.cluster.name}/${aws_ecs_service.service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_cpu" {
  name               = "${var.project_name}-cpu-auto-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 60.0
  }
}
