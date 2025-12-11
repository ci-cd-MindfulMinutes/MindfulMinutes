# MindfulMinutes - Terraform Infrastructure

This directory contains Infrastructure as Code (IaC) using Terraform to provision AWS resources.

## Prerequisites

1. **Terraform installed** (v1.0+)
   ```bash
   terraform --version
   ```

2. **AWS CLI configured**
   ```bash
   aws configure
   ```

3. **S3 Bucket for Terraform State** (create manually first)
   ```bash
   aws s3 mb s3://mindfulminutes-terraform-state --region us-east-1
   aws s3api put-bucket-versioning --bucket mindfulminutes-terraform-state --versioning-configuration Status=Enabled
   ```

4. **DynamoDB Table for State Locking** (create manually first)
   ```bash
   aws dynamodb create-table \
     --table-name mindfulminutes-terraform-state-lock \
     --attribute-definitions AttributeName=LockID,AttributeType=S \
     --key-schema AttributeName=LockID,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST \
     --region us-east-1
   ```

## Infrastructure Components

- **Backend EC2**: Node.js API server with Docker
- **Elastic IP**: Static IP for backend (for MongoDB Atlas whitelist)
- **S3 Bucket**: Frontend static file hosting
- **CloudFront**: CDN for frontend distribution
- **Security Groups**: Firewall rules for EC2

## Usage

### Initialize Terraform
```bash
cd terraform
terraform init
```

### Deploy Development Environment
```bash
# Create and switch to dev workspace
terraform workspace new dev

# Plan and apply
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
```

### Deploy Production Environment
```bash
# Create and switch to prod workspace
terraform workspace new prod

# Plan and apply
terraform plan -var-file="prod.tfvars"
terraform apply -var-file="prod.tfvars"
```

### Switch Between Environments
```bash
# List workspaces
terraform workspace list

# Switch to dev
terraform workspace select dev

# Switch to prod
terraform workspace select prod
```

### View Outputs
```bash
terraform output
```

### Destroy Resources
```bash
# Make sure you're in the right workspace first!
terraform workspace select dev
terraform destroy -var-file="dev.tfvars"  
```

## Important Notes

1. **Workspaces**: Dev and prod use separate Terraform workspaces for state isolation
2. **Backend State**: Terraform state is stored remotely in S3 (separate files per workspace)
3. **Elastic IPs**: Used for static backend IPs (whitelist in MongoDB Atlas)
4. **Costs**: t2.micro (free tier eligible), CloudFront (minimal cost)
5. **Security**: Update security group rules for production use

## Outputs

After `terraform apply`, you'll get:
- `backend_elastic_ip`: IP address for backend API
- `cloudfront_url`: Frontend URL
- `s3_bucket_name`: Frontend bucket name
- `cloudfront_distribution_id`: For cache invalidation
