# Terraform Backend Initial Setup

This is a **ONE-TIME setup** required before using Terraform.

## Why This Step?

Terraform needs an S3 bucket and DynamoDB table to:
- **S3 Bucket**: Store the infrastructure state file (what resources exist)
- **DynamoDB Table**: Lock the state file (prevent conflicts when multiple people run Terraform)

These must be created **manually first** because Terraform can't create its own backend (chicken-and-egg problem).

## Cost

**Total cost: < $0.01/month** (essentially free)

- S3 storage for state files: ~$0.000002/month (state files are tiny, ~100 KB)
- DynamoDB requests: ~$0.00001/month (only accessed during terraform operations)

You won't see these charges on your bill - they're too small.

## Prerequisites

1. AWS CLI installed and configured
   ```bash
   aws configure
   ```

2. AWS credentials with permissions:
   - S3: CreateBucket, PutBucketVersioning
   - DynamoDB: CreateTable

## Setup Steps

### Step 1: Create S3 Bucket for Terraform State

```bash
aws s3 mb s3://mindfulminutes-terraform-state --region us-east-1
```

**What this does:** Creates an S3 bucket named `mindfulminutes-terraform-state` in `us-east-1` region.

**Expected output:**
```
make_bucket: mindfulminutes-terraform-state
```

---

### Step 2: Enable Versioning on S3 Bucket

```bash
aws s3api put-bucket-versioning \
  --bucket mindfulminutes-terraform-state \
  --versioning-configuration Status=Enabled
```

**What this does:** Enables versioning so you can recover previous state file versions if needed.

**Expected output:** (No output means success)

---

### Step 3: Verify S3 Bucket

```bash
aws s3 ls | grep mindfulminutes-terraform-state
```

**Expected output:**
```
2024-XX-XX XX:XX:XX mindfulminutes-terraform-state
```

---

### Step 4: Create DynamoDB Table for State Locking

```bash
aws dynamodb create-table \
  --table-name mindfulminutes-terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**What this does:** Creates a DynamoDB table that Terraform uses to lock the state file during operations.

**Expected output:**
```json
{
    "TableDescription": {
        "TableName": "mindfulminutes-terraform-state-lock",
        "TableStatus": "CREATING",
        ...
    }
}
```

---

### Step 5: Wait for DynamoDB Table to be Active

```bash
aws dynamodb wait table-exists \
  --table-name mindfulminutes-terraform-state-lock \
  --region us-east-1
```

**What this does:** Waits until the table is fully created and ready.

**Expected output:** (Returns when ready, takes ~30 seconds)

---

### Step 6: Verify DynamoDB Table

```bash
aws dynamodb describe-table \
  --table-name mindfulminutes-terraform-state-lock \
  --region us-east-1 \
  --query 'Table.TableStatus'
```

**Expected output:**
```
"ACTIVE"
```

---

## ✅ Setup Complete!

You now have:
- ✅ S3 bucket: `mindfulminutes-terraform-state` (with versioning enabled)
- ✅ DynamoDB table: `mindfulminutes-terraform-state-lock` (ACTIVE status)

## Next Steps

You can now initialize Terraform:

```bash
cd terraform
terraform init
```

This will connect to the S3 backend and you're ready to use Terraform!

## Troubleshooting

### Error: "BucketAlreadyExists"
**Problem:** Bucket name already taken by someone else (S3 bucket names are globally unique).

**Solution:** Change the bucket name in `backend.tf`:
```hcl
bucket = "mindfulminutes-terraform-state-YOUR-INITIALS"
```

Then re-run the S3 creation commands with the new name.

---

### Error: "ResourceInUseException" (DynamoDB)
**Problem:** Table already exists.

**Solution:** Table is already created, skip this step and proceed to `terraform init`.

---

### Error: "AccessDenied"
**Problem:** AWS credentials don't have required permissions.

**Solution:**
1. Check AWS credentials: `aws sts get-caller-identity`
2. Ensure your IAM user has `AdministratorAccess` or specific S3/DynamoDB permissions

---

## Cleanup (After Project)

To remove these resources after your project is done:

```bash
# Delete S3 bucket (must be empty first)
aws s3 rb s3://mindfulminutes-terraform-state --force

# Delete DynamoDB table
aws dynamodb delete-table \
  --table-name mindfulminutes-terraform-state-lock \
  --region us-east-1
```

**Note:** Only do this AFTER you've destroyed all Terraform-managed resources and no longer need the state files.
