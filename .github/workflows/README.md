# CI/CD Workflows

This directory contains GitHub Actions workflows for automated infrastructure provisioning and application deployment.

## Workflows

### 1. **infrastructure.yml** - Terraform Infrastructure
**Triggers:**
- Push to `main` branch with changes in `terraform/` directory
- Manual trigger via `workflow_dispatch`

**What it does:**
- Initializes Terraform
- Selects appropriate workspace (dev/prod)
- Plans and applies infrastructure changes
- Outputs infrastructure details (EC2 IPs, CloudFront URLs, etc.)

**Environment:** Configurable via manual trigger (default: dev)

---

### 2. **capture-outputs.yml** - Capture Terraform Outputs
**Triggers:**
- Runs after `infrastructure.yml` completes successfully

**What it does:**
- Extracts Terraform outputs (backend IP, S3 bucket, CloudFront URL/ID)
- Displays outputs in workflow logs
- Makes outputs available for deployment workflows

---

### 3. **deploy-frontend.yml** - Frontend Deployment
**Triggers:**
- Push to `main` branch with changes in `frontend/` directory
- Manual trigger via `workflow_dispatch`

**What it does:**
- Installs Node.js dependencies
- Builds Angular application for production
- Deploys static files to S3
- Invalidates CloudFront cache for immediate updates

**Environment:** Configurable via manual trigger (default: dev)

---

### 4. **deploy-backend.yml** - Backend Deployment
**Triggers:**
- Push to `main` branch with changes in `backend/` directory
- Manual trigger via `workflow_dispatch`

**What it does:**
- Builds Docker image for backend
- Pushes image to Amazon ECR
- Retrieves backend EC2 instance IP
- Prepares deployment to EC2

**Environment:** Configurable via manual trigger (default: dev)

---

## Required GitHub Secrets

Configure these secrets in your repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUtnFEMI/K7MDENG/...` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |

**To add secrets:**
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret listed above

---

## Workflow Execution Order

**Initial Infrastructure Setup:**
```
1. infrastructure.yml (manual trigger)
   ↓
2. capture-outputs.yml (automatic)
```

**Application Deployment:**
```
Frontend changes:
  push to frontend/ → deploy-frontend.yml

Backend changes:
  push to backend/ → deploy-backend.yml
```

---

## Manual Workflow Triggers

All workflows can be triggered manually:

1. Go to **Actions** tab in GitHub
2. Select the workflow
3. Click **Run workflow**
4. Choose environment (dev or prod)
5. Click **Run workflow** button

---

## Path-Based Triggers

Workflows only run when relevant files change:

- `terraform/**` → Infrastructure workflow
- `frontend/**` → Frontend deployment
- `backend/**` → Backend deployment

This prevents unnecessary deployments and saves build minutes.

---

## Workflow Dependencies

- **capture-outputs.yml** depends on **infrastructure.yml**
- Deployment workflows are independent
- All workflows require AWS credentials

---

## Monitoring Workflow Runs

View workflow status:
1. Go to **Actions** tab
2. See all workflow runs with status (✅ success, ❌ failed, ⏸️ in progress)
3. Click on a run to see detailed logs
4. Expand steps to see command outputs

---

## Troubleshooting

### Error: "AWS credentials not found"
**Solution:** Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets

### Error: "Terraform workspace not found"
**Solution:** Infrastructure workflow will create workspace automatically

### Error: "S3 bucket does not exist"
**Solution:** Run infrastructure workflow first to create resources

### Error: "CloudFront distribution not found"
**Solution:** Verify infrastructure was deployed successfully

---

## Best Practices

1. **Always deploy infrastructure first** before deploying applications
2. **Use manual triggers** for initial setup and testing
3. **Review logs** after each deployment
4. **Test in dev** before deploying to prod
5. **Monitor costs** - workflows consume build minutes and AWS resources
