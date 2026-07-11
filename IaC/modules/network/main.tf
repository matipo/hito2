resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "${var.project_name}-vpc"
    Project = var.project_name
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name    = "${var.project_name}-igw"
    Project = var.project_name
  }
}

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet1_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-subnet1"
    Project = var.project_name
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet2_cidr
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${var.project_name}-subnet2"
    Project = var.project_name
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name    = "${var.project_name}-rt"
    Project = var.project_name
  }
}

resource "aws_route" "internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# Prefixed list de IPs de CloudFront (para restringir acceso al ALB solo desde CloudFront)
data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

# Security Group para el ALB (solo permite tráfico desde CloudFront)
resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-sg-alb-"
  description = "Security group para el ALB - solo desde CloudFront"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from CloudFront"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  egress {
    description = "Outbound traffic to internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-sg-alb"
    Project = var.project_name
  }
}

# Security Group para las tareas ECS (solo trafico desde el ALB)
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-sg-ecs"
  description = "Security group para tareas ECS - solo trafico desde el ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "HTTPS to VPC Endpoints and API Gateway"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-sg-ecs"
    Project = var.project_name
  }
}

# ──────────────────────────────────────────────────────────────
# VPC Endpoints — tráfico AWS sin salir por internet público
# ──────────────────────────────────────────────────────────────

# Security Group para los Interface Endpoints (ECR)
resource "aws_security_group" "vpce" {
  name_prefix = "${var.project_name}-sg-vpce-"
  description = "Security group para VPC Endpoints - solo desde ECS"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTPS from ECS tasks"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  tags = {
    Name    = "${var.project_name}-sg-vpce"
    Project = var.project_name
  }
}

# --- Gateway Endpoints (gratis, sin ENIs) ---

resource "aws_vpc_endpoint" "dynamodb" {
  service_name       = "com.amazonaws.${var.aws_region}.dynamodb"
  vpc_id             = aws_vpc.main.id
  vpc_endpoint_type  = "Gateway"
  route_table_ids    = [aws_route_table.public.id]

  tags = {
    Name    = "${var.project_name}-vpce-dynamodb"
    Project = var.project_name
  }
}

resource "aws_vpc_endpoint" "s3" {
  service_name       = "com.amazonaws.${var.aws_region}.s3"
  vpc_id             = aws_vpc.main.id
  vpc_endpoint_type  = "Gateway"
  route_table_ids    = [aws_route_table.public.id]

  tags = {
    Name    = "${var.project_name}-vpce-s3"
    Project = var.project_name
  }
}

# --- Interface Endpoints (crean ENIs, costo mínimo) ---

resource "aws_vpc_endpoint" "ecr_dkr" {
  service_name        = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  security_group_ids  = [aws_security_group.vpce.id]
  private_dns_enabled = true

  tags = {
    Name    = "${var.project_name}-vpce-ecr-dkr"
    Project = var.project_name
  }
}

resource "aws_vpc_endpoint" "ecr_api" {
  service_name        = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_id              = aws_vpc.main.id
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  security_group_ids  = [aws_security_group.vpce.id]
  private_dns_enabled = true

  tags = {
    Name    = "${var.project_name}-vpce-ecr-api"
    Project = var.project_name
  }
}
