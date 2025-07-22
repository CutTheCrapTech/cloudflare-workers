---
sidebar_position: 5
title: Email Routing Setup
---

# Email Routing Setup for Cloudflare Worker

Regardless of your chosen deployment method, you need to configure Cloudflare Email Routing to direct incoming emails to your worker.

1.  **Enable Email Routing:**
    -   Go to your domain in the Cloudflare Dashboard.
    -   Navigate to **Email** → **Email Routing**.
    -   Follow the prompts to enable Email Routing for your domain.

2.  **Add MX Records:**
    -   Cloudflare will prompt you to add necessary MX records to your DNS. Ensure these are correctly configured.

3.  **Configure Routing Rules:**
    -   Still in **Email** → **Email Routing** → **Routing Rules**.
    -   You need to create a catch-all rule that forwards all emails sent to your domain to your deployed Cloudflare Worker.
    -   Select your deployed worker as the destination.

4.  **Verify Your Destination Email:**
    -   Ensure that the `default_email_address` specified in your `EMAIL_OPTIONS` is a verified destination in Cloudflare Email Routing. Cloudflare will send a verification email to this address.
