# Terraform state backend configuration
# This stores your Terraform state file remotely in S3
# You need to manually create this S3 bucket first before running terraform init

terraform {
  backend "s3" {
    bucket         = "mindfulminutes-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
