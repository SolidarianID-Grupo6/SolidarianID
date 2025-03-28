#!/bin/bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo systemctl enable docker
sudo yum install -y git

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.32.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version