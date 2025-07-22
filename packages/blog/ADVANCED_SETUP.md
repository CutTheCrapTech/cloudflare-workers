# Advanced Setup

This hybrid approach provides the most robust and automated deployment. If you are using [homelab](https://github.com/CutTheCrapTech/homelab/) or plan to change the action / infisical secrets manually to adapt to your needs, this is the recommended method.

- **Terraform Handles:**
  - Email Routing configuration
  - DNS setup for your domain
- **GitHub Action Handles:**
  - Cloudflare Workers deployment
  - Environment and secret management via [Infisical](https://infisical.com/)

This method is ideal for production deployments and teams managing multiple environments, as it combines infrastructure-as-code with a seamless CI/CD pipeline for the worker itself.

## GitHub Action: `deploy-workers`

This workflow, located at `/.github/workflows/publish-worker.yaml`, automates the deployment of the Cloudflare Worker.

### **Prerequisites**

1.  **Modify the `.env` file** in the root of the repository with your Infisical details.

2.  **Add `INFISICAL_CLIENT_SECRET` to GitHub Secrets:**
    - In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**.
    - Create a new repository secret named `INFISICAL_CLIENT_SECRET` with the client secret from your Infisical Machine Identity.

3.  **Ensure Secrets are in Infisical:** The action expects the following secrets to be available in their respective Infisical paths:
    - `CLOUDFLARE_ACCOUNT_ID`: Should be present in the `/tofu` secret path. You would have set this already if using [homelab](https://github.com/CutTheCrapTech/homelab/tree/main/tofu/cloudflare/account-tokens) or create one.
    - `TF_VAR_cloudflare_email_tofu_token`: Should be present in the `/tofu_rw` secret path. This is a scoped API token for Cloudflare, automatically created by the [homelab](https://github.com/CutTheCrapTech/homelab/tree/main/tofu/cloudflare/account-tokens) or create an account or user token manually with permissions deploy workers.
    - All worker-specific environment variables and secrets should be in the `/cloudflare_worker_env` path.
      - EMAIL_OPTIONS = {"default_email_address":"your-real-email@gmail.com","ignore_email_checks":["trusted-receiver@example.com"]}
      - EMAIL_SECRET_MAPPING = { "secret1": "user1@gmail.com", "secret2" "user2@gmail.com" }

    > **Note for Non-Infisical Users:** If you are not using Infisical, you will need to adapt the `/.github/workflows/publish-worker.yaml` file. You can either modify the Infisical steps to pull from a different source or replace them entirely by providing the `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` and other worker env variables as standard GitHub Actions secrets. For a simpler setup, consider using the [Wrangler CLI](README.md#option-2-wrangler-cli-recommended) or [Manual Deployment](README.md#option-1-manual-deployment-beginner-friendly).

### **How to Run**

**1. Automated (on new release):**
The action is automatically triggered by the `publish.yaml` workflow whenever a new version of the `@email-gateway/cloudflare-worker` package is published. No manual intervention is needed.

**2. Manual Deployment:**
You can manually trigger the workflow to deploy a specific version of the worker.

- Go to the **Actions** tab in your GitHub repository.
- Select the **Deploy Workers** workflow from the list.
- Click the **Run workflow** dropdown.
- Enter the package name: `@email-gateway/cloudflare-worker`.
- Click **Run workflow**.

The action will find the latest published version of the package and deploy it to the environment determined by the branch the action is run on (`main`/`prod` -> `prod`, `staging` -> `staging`, others -> `dev`).
