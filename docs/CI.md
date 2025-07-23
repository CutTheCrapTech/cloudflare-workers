# Continuous Integration (CI) and Continuous Deployment (CD)

This project utilizes GitHub Actions for its CI/CD pipelines, ensuring code quality, automated testing, and streamlined deployments.

## Core CI Workflow (`.github/workflows/ci.yaml`)

The main CI workflow runs on every push to `main` and `feature/**` branches, and on every pull request targeting `main`. Its primary responsibilities include:

- **Checkout Repository**: Fetches the latest code.
- **Install pnpm**: Ensures the correct package manager is available.
- **Setup Node.js**: Configures the Node.js environment with caching for `pnpm` dependencies.
- **Install Dependencies**: Installs all project dependencies using `pnpm install --frozen-lockfile`.
- **Run Comprehensive CI Checks**: Executes the `pnpm run ci` command, which typically includes:
  - Type checking
  - Linting
  - Unit and integration tests
  - Build verification

## Changeset Check Workflow (`.github/workflows/check-changesets.yaml`)

This workflow runs on pull requests to `main` and helps maintain proper versioning and changelog generation. It:

- Detects if user-facing code changes are present in a pull request.
- Checks if a corresponding [Changeset](https://github.com/changesets/changesets) has been added.
- Comments on the pull request to remind contributors to add a changeset if needed.

## Versioning Workflow (`.github/workflows/version.yaml`)

This workflow is responsible for versioning packages based on changesets and creating release pull requests. It triggers on:

- Manual dispatch (`workflow_dispatch`).
- Pull requests closed to `main`.
- Pushes to `main`.

It uses the `changesets/action` to:

- Increment package versions.
- Update `CHANGELOG.md` files.
- Create a "Version packages" pull request (or commit directly on `main` after PR merge).

## Publishing Workflow (`.github/workflows/publish.yaml`)

This workflow handles the publication of packages and deployments. It is primarily triggered manually via `workflow_dispatch` and can perform the following actions:

- **Create GitHub Releases**: Generates new GitHub releases for published packages.
- **Publish to npm**: Publishes updated packages to the npm registry.
- **Publish Browser Extensions**: Calls a reusable workflow (`publish-extensions.yaml`) to deploy browser extensions.
- **Deploy Cloudflare Workers**: Calls a reusable workflow (`publish-worker.yaml`) to deploy Cloudflare Workers to specified environments (e.g., production, staging).

This workflow leverages the `changesets/action` for publishing and orchestrates the deployment of different application components.

**`workflow_dispatch` Inputs:**

- `create_releases` (boolean, default: `true`): Whether to create GitHub releases.
- `publish_npm` (boolean, default: `true`): Whether to publish to npm.
- `publish_worker` (boolean, default: `false`): Whether to deploy Cloudflare Worker.

## Deploy Workers Workflow (`.github/workflows/publish-worker.yaml`)

This reusable workflow is called by the `publish.yaml` workflow (or can be triggered manually via `workflow_dispatch`). It is responsible for deploying Cloudflare Workers. Key features include:

- **Environment Selection**: Allows specifying the deployment environment (e.g., `production`, `staging`).
- **Package Filtering**: Allows filtering workers to deploy based on package name.
- **Force Deploy**: Option to force deployment even if no changes are detected.
- **Environment Variables**: Utilizes secrets for Cloudflare API token and account ID.

**`workflow_dispatch` Inputs:**

- `environment` (choice, default: `production`): Deployment environment (`production` or `staging`).
- `package_filter` (string, optional): Package name filter (e.g., 'my-worker').
- `force_deploy` (boolean, default: `false`): Force deploy even if no changes detected.

The action will find the latest published version of the package and deploy it to the environment determined by the branch the action is run on (`main`/`prod` -> `prod`, `staging` -> `staging`, others -> `dev`).

## **Prerequisites**

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
