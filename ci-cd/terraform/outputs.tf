output "public_ip" {
  value = module.ec2_instance.public_ip
}

output "ec2_instance_id" {
  value = module.ec2_instance.ec2_instance_id
}