# Terraform state backend configuration
# This stores your Terraform state file remotely in S3
# Terraform workspaces automatically separate dev/prod states:
# - Dev: env:/dev/terraform.tfstate
# - Prod: env:/prod/terraform.tfstate


terraform {
  backend "s3" {
    bucket         = "mindfulminutes-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "mindfulminutes-terraform-state-lock"
    encrypt        = true    
  }
}
