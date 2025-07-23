---
slug: secure-email-gateway
title: "Building a Secure Email Gateway with Cloudflare Workers"
date: "2025-07-22"
authors: [karteek]
tags: [cloudflare, email, security, typescript, privacy]
---

In today's digital age, protecting your email address is more important than ever. Spam, phishing, and tracking are rampant. This blog post will guide you through building a secure email gateway using Cloudflare Workers, providing a robust solution to these problems. We'll be leveraging a suite of my open-source projects, designed to work together to create a system that's not only secure but also flexible and easy to maintain.

<!-- truncate -->

## The Quest for the Perfect Email Alias Solution

I created this project out of a personal need for a better email aliasing solution. I'd tried other services, but none of them quite hit the mark.

- **[SimpleLogin](https://simplelogin.io/)** is a great service, but it can be difficult to self-host, and the paid plans can be a barrier for some.
- **[DuckDuckGo Email](https://duckduckgo.com/email/)** is free and provides unlimited aliases and email tracker cleaning, but you can't use your own domain. This lack of portability was a deal-breaker for me.

I wanted a solution that combined the best of both worlds: the ability to use my own domain, the privacy of tracker cleaning, and the freedom of being open-source and completely free. That's why I created this suite of tools.

## The Core Components

Our secure email gateway is built upon a few key components:

- **[`email-alias-core`](https://github.com/CutTheCrapTech/email-gateway-cloudflare/tree/main/packages/email-alias-core)**: A zero-dependency library for creating and verifying secure, HMAC-based email aliases. This is the heart of our system, allowing us to generate unique aliases on the fly.
- **[`email-scrubber-core`](https://github.com/CutTheCrapTech/email-scrubber-core)**: A library designed to sanitize emails by removing tracking pixels and cleaning URLs. This enhances your privacy by preventing senders from tracking your activity.
- **[Cloudflare Workers](https://github.com/CutTheCrapTech/email-gateway-cloudflare/tree/main/packages/cloudflare-worker)**: The serverless platform that will host our email gateway. Cloudflare's global network ensures low-latency and high-availability.
- **[Browser Extensions](https://github.com/CutTheCrapTech/email-gateway-cloudflare/tree/main/packages/browser-extensions)**: Companion extensions for Chrome and Firefox to easily generate email aliases directly in your browser.

The entire project is open-source and available on GitHub: **[email-gateway-cloudflare](https://github.com/CutTheCrapTech/email-gateway-cloudflare)**

## How it Works

The system works by creating unique, verifiable email aliases for different services. Instead of giving your real email address to a new service, you generate an alias like `shopping-amazon-a1b2c3d4@yourdomain.com`.

This system is designed for both a single user and multiple users (like a family). Each user can have their own secret key (token), and each token can be configured to forward to a specific email address.

Here's the magic:

1.  **Alias Generation**: The browser extension, using `email-alias-core`, generates a cryptographically secure alias. This alias is tied to a secret key that only you and your Cloudflare Worker know.
2.  **Email Reception**: When an email is sent to this alias, it's first received by your Cloudflare Worker.
3.  **Verification**: The Cloudflare Worker uses `email-alias-core` and your secret key to verify the alias. If the alias is valid, the email is forwarded to your real inbox. If it's not, it's rejected. This stops spam and phishing attempts in their tracks.
4.  **Sanitization (Future)**: The `email-scrubber-core` library is designed to remove tracking pixels and clean URLs in emails. **Note:** Currently, Cloudflare Workers do not support modifying the body of an email. Once this feature is available, `email-scrubber-core` will be integrated to provide this privacy enhancement.

This HMAC-based system is a significant improvement over a simple catch-all address, which is a magnet for spam.

## Getting Started

To get started, you'll need to deploy the Cloudflare Worker and install the browser extension.

### Cloudflare Worker Deployment

The Cloudflare Worker is the core of the email gateway. You can deploy it using a few different methods:

- **Terraform**: For those who prefer infrastructure-as-code, a Terraform module is available in the [homelab repository](https://github.com/CutTheCrapTech/homelab/tree/main/tofu/cloudflare/email-alias/).
- **Wrangler CLI**: The recommended method for most users. The `wrangler.toml` file makes configuration straightforward.
- **Manual Deployment**: For beginners, you can manually copy and paste the worker code into the Cloudflare dashboard.

You'll need to configure your domain, secret keys, and destination email address as environment variables in your Cloudflare Worker settings.

### Browser Extension

The browser extensions for [Chrome](https://chromewebstore.google.com/detail/email-alias-generator/ghhkompkfhenihpidldalcocbfplkdgm) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/email-alias-generator-hmac/) provide a seamless experience for generating aliases. After installation, you'll need to configure the extension with your domain and secret key.

## The "Key Ring Model" for Security and Recovery

A key feature of this system is the "Key Ring Model". Your Cloudflare Worker can hold multiple secret keys. If you ever lose the key from your browser extension, you can simply generate a new one and add it to your worker's configuration. Your old aliases will continue to work, making recovery a breeze.

## FAQ

**What happens if I lose a token?**

If you lose a token, you will continue to receive emails on aliases created with that token, as long as the token is still present in your Cloudflare Worker's secrets. You can generate a new token in the browser extension and add it to your Cloudflare Worker to create new aliases.

**What happens if a token is stolen?**

If a token is stolen, the thief can generate email aliases that your system will see as valid. This could be used to send you spam or phishing emails. If you suspect a token has been compromised, you should remove it from your Cloudflare Worker's secrets immediately.

**What if I want to reply to emails?**

Currently, you can use a service like [Brevo](https://www.brevo.com/) to send emails from your custom domain. Integration with cloud email sending services (like AWS SES, etc) is WIP.

**Is this project really free?**

Yes, this entire suite of tools is open-source and free to use. You can inspect the code, customize it to your needs, and you don't have to worry about it disappearing or becoming a paid service. Even if Cloudflare changes its services, the core logic is portable. Because you own your domain and the alias generation method, you can move to another service, ensuring you never lose access to your aliases.

**Will this cost me anything to run?**

For the vast majority of users, this solution will be completely free. The Cloudflare Workers free tier is very generous, allowing for 100,000 requests per day and 1,000 per minute. Unless you are receiving an extremely high volume of email, you are unlikely to exceed these limits.

## Conclusion

By combining the power of `email-alias-core`, `email-scrubber-core`, and Cloudflare Workers, you can create a powerful, secure, and private email gateway. This system gives you control over your email, protecting you from spam and surveillance. The modular nature of this open-source suite makes it easy to understand, customize, and contribute to.
