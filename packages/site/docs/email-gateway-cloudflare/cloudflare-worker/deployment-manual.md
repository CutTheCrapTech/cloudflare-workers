---
sidebar_position: 6
title: Deployment - Manual
---

# Cloudflare Worker Deployment: Manual

For a simple, one-time setup without additional tooling, you can manually deploy your worker via the Cloudflare Dashboard.

1.  **Download the worker code:**
    -   Go to the [GitHub releases page](https://github.com/CutTheCrapTech/email-gateway-cloudflare/releases) for `email-gateway-cloudflare`.
    -   Find the release corresponding to the latest version of `@email-gateway/cloudflare-worker`.
    -   Download `dist.zip` from the Assets section, which contains `worker.js`.

2.  **Access Cloudflare Dashboard:**
    -   Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
    -   Navigate to **Workers & Pages** → **Create Application** → **Create Worker**.

3.  **Upload the code:**
    -   Replace the default code in the editor with the contents of the downloaded `worker.js` file.
    -   Click **Save and Deploy**.

4.  **Configure Environment Variables:**
    -   Go to **Settings** → **Variables and Secrets**.
    -   Under "Environment Variables", add a new variable:
        -   **Variable name:** `EMAIL_OPTIONS`
        -   **Value:** Paste your `EMAIL_OPTIONS` JSON string (e.g., `{"default_email_address":"your-real-email@gmail.com","ignore_email_checks":["trusted-receiver@example.com"]}`).

5.  **Set Secrets:**
    -   In the same **Variables and Secrets** section, under "Secrets", add a new secret:
        -   **Secret name:** `EMAIL_SECRET_MAPPING`
        -   **Value:** Paste your `EMAIL_SECRET_MAPPING` JSON string (e.g., `{"secret1": "user1@gmail.com", "secret2": "user2@gmail.com"}`).

6.  **Configure Email Routing:** (This step is common to all deployment methods and is detailed in the next section.)
