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

  provisioner "file" {
    source      = var.project_path
    destination = "/home/ec2-user/project"
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(var.private_key_path)
      host        = self.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "cd /home/ec2-user/project",
      "sudo docker-compose up -d --build"
    ]
    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(var.private_key_path)
      host        = self.public_ip
    }
  }
}