# CI/CD Workflows

This directory contains GitHub Actions workflows for automated infrastructure provisioning and application deployment.

## Workflows

### 1. **infrastructure.yml** - Terraform Infrastructure
**Triggers:**
- Push to `dev` or `main` branch with changes in `terraform/` directory
- Manual trigger via `workflow_dispatch`

**What it does:**
- Automatically detects environment based on branch (dev/main)
- Initializes Terraform
- Selects appropriate workspace (dev/prod)
- Plans and applies infrastructure changes
- Outputs infrastructure details in workflow logs

**Environment:** Auto-detected from branch

---

### 2. **deploy-frontend.yml** - Frontend Deployment
**Triggers:**
- Push to `dev` or `main` branch with changes in `frontend/` directory
- Manual trigger via `workflow_dispatch`

**What it does:**
- Automatically detects environment based on branch
- Installs Node.js dependencies
- Builds Angular application for production
- Deploys static files to S3
- Queries AWS for CloudFront distribution
- Invalidates CloudFront cache for immediate updates

**Environment:** Auto-detected from branch

---

### 3. **deploy-backend.yml** - Backend Deployment
**Triggers:**
- Push to `dev` or `main` branch with changes in `backend/` directory
- Manual trigger via `workflow_dispatch`

**What it does:**
- Automatically detects environment based on branch
- Builds Docker image for backend
- Pushes image to Amazon ECR
- Queries AWS for backend EC2 instance IP
- Prepares deployment to EC2

**Environment:** Auto-detected from branch

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
Push to dev/main with terraform/ changes → infrastructure.yml
```

**Application Deployment:**
```
Push to dev/main with frontend/ changes → deploy-frontend.yml
Push to dev/main with backend/ changes → deploy-backend.yml
```

**Branch-based deployment:**
```
dev branch  → Deploys to dev environment
main branch → Deploys to prod environment
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

- All workflows are independent and self-contained
- Deployment workflows query AWS directly for resource details
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
