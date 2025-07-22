---
sidebar_position: 5
title: Deployment - Wrangler CLI
---

# Cloudflare Worker Deployment: Wrangler CLI

Wrangler is Cloudflare's official CLI tool for developing and deploying Workers.

## Prerequisites for Wrangler CLI Deployment

Before proceeding with Wrangler CLI deployment, ensure you have the following:

- **Node.js:** Version 22 or later recommended. You can download it from [nodejs.org](https://nodejs.org/).
- **npm:** Version 9 or later. This usually comes bundled with Node.js.
- **Git:** A local Git client for cloning repositories.
- **pnpm:** This project uses [pnpm](https://pnpm.io/) for package management. If you don't have it, install it globally.

## Deployment Steps

1. Clone the [repository](https://github.com/CutTheCrapTech/email-gateway-cloudflare) using git:

   ```bash
   git clone https://github.com/CutTheCrapTech/email-gateway-cloudflare.git
   ```

2. **Install Wrangler (and project dependencies):**

   ```bash
   cd packages/cloudflare-worker
   pnpm install
   ```

3. **Authenticate with Cloudflare:**

   ```bash
   npx wrangler login
   ```

   Follow the prompts in your browser to authenticate your Wrangler CLI with your Cloudflare account.

4. **Build the worker:**

   ```bash
   pnpm run build
   ```

   This command compiles your worker code into a deployable JavaScript file.

5. **Create configuration file:**

   ```bash
   cp wrangler.toml.template wrangler.toml
   ```

   Edit the `wrangler.toml` file with your specific values for `name`, `main`, `compatibility_date`, `EMAIL_OPTIONS`, and `[[email]]` section as described in the [Configuration](configuration.md) section.

6. **Set secrets:**

   ```bash
   wrangler secret put EMAIL_SECRET_MAPPING
   ```

   When prompted, paste your JSON string for `EMAIL_SECRET_MAPPING` (e.g., `{"secret1": "user1@gmail.com", "secret2": "user2@gmail.com"}`).

7. **Deploy:**
   ```bash
   wrangler deploy
   ```
   This command deploys your worker to Cloudflare.
