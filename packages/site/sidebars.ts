import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "index",
    {
      type: "category",
      label: "Email Gateway Cloudflare",
      link: {
        type: "doc",
        id: "email-gateway-cloudflare/index", // Link to the new index.md
      },
      items: [
        {
          type: "category",
          label: "Browser Extensions",
          items: [
            "email-gateway-cloudflare/browser-extensions/index",
            "email-gateway-cloudflare/browser-extensions/installation",
            "email-gateway-cloudflare/browser-extensions/usage",
          ],
        },
        {
          type: "category",
          label: "Cloudflare Worker",
          items: [
            "email-gateway-cloudflare/cloudflare-worker/index",
            "email-gateway-cloudflare/cloudflare-worker/prerequisites",
            "email-gateway-cloudflare/cloudflare-worker/configuration",
            {
              type: "category",
              label: "Deployment Options",
              items: [
                "email-gateway-cloudflare/cloudflare-worker/deployment-terraform",
                "email-gateway-cloudflare/cloudflare-worker/deployment-wrangler",
                "email-gateway-cloudflare/cloudflare-worker/deployment-manual",
              ],
            },
            "email-gateway-cloudflare/cloudflare-worker/email-routing",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
