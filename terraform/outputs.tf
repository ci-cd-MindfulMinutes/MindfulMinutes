# Terraform Outputs
# These values will be used by GitHub Actions for deployments

output "backend_elastic_ip" {
  description = "Elastic IP address of the backend EC2 instance"
  value       = aws_eip.backend_eip.public_ip
}

output "backend_instance_id" {
  description = "ID of the backend EC2 instance"
  value       = aws_instance.backend.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_url" {
  description = "CloudFront distribution domain name"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "api_gateway_url" {
  description = "API Gateway endpoint URL for backend"
  value       = "${aws_api_gateway_stage.backend.invoke_url}"
}
