terraform {
  backend "s3" {
    bucket         = "solidarianid-tf-state" # REPLACE WITH YOUR BUCKET NAME
    key            = "terraform/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-locking"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

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

module "ec2_instance" {
  source          = "./ec2"
  ami_id          = var.ami_id
  instance_type   = var.instance_type
  key_name        = var.key_name
  subnet_id       = module.network.public_subnet_id
  security_groups = [module.security_groups.ec2_security_group_id]
  instance_name   = "solidarianid-1"
}