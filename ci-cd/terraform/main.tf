provider "aws" {
  region = "us-east-1"
}

module "network" {
  source = "./network"
}

module "security_groups" {
  source = "./security_groups"
  vpc_id = module.network.vpc_id
}

resource "aws_instance" "ec2_instance" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = var.subnet_id
  security_groups = [var.security_group_id]

  user_data = file("${path.module}/user_data.sh")

  tags = {
    Name = "docker-ec2-instance"
  }
}