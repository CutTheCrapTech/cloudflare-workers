---
slug: changeset-releases-monorepos
title: "Streamlining Package Releases with Changesets in Monorepos"
date: "2025-07-23"
authors: [karteek]
tags: ["cloudflare", "changesets", "monorepo", "release management", "ci/cd"]
---

# Streamlining Monorepo Releases with Changesets

Managing releases in a monorepo can be a complex endeavor, especially when dealing with diverse deployment targets. This post delves into the intricacies of using Changesets for release management in such a setup, how to configure it for private packages, how to handle additional assets for github release using the action, etc, while highlighting its advantages over tools like Semantic-Release, particularly for monorepos.

<!-- truncate -->

## Why Changesets for Monorepos? A Comparison with Semantic-Release

My personal journey led me from Semantic-Release to Changesets, primarily due to the latter's superior monorepo support.

### Semantic-Release: Strengths and Weaknesses

Semantic-Release is fantastic for single repositories, automating versioning and releases based on commit messages. Its plugin architecture is powerful, allowing for extensive customization, including asset uploading.

However, in a monorepo context, Semantic-Release can become cumbersome. Managing independent versioning for multiple packages within the same repository often requires complex configurations and workarounds. The commit message-based approach, while elegant for single projects, can lead to verbose or ambiguous commit messages when a single commit affects multiple packages with different release implications. On top of that, semantic-release have an opnionated approach, one package per repository, and they don't plan to support monorepos anytime soon (but unofficial plugins exists for the same).

### Changesets: Monorepo First

Changesets, on the other hand, was designed with monorepos in mind from the ground up. Its core philosophy revolves around explicit "changeset" files that describe the changes for each package. This offers several key advantages:

- **Explicit Change Descriptions:** Each change is documented in a dedicated file, making it clear which packages are affected and what kind of change it is (patch, minor, major). This is invaluable for generating accurate changelogs and understanding the impact of a release.
- **Independent Versioning:** Changesets naturally supports independent versioning for packages within a monorepo. A change in one package doesn't necessarily force a version bump on all others.
- **Collaborative Workflow:** Developers create changeset files as part of their feature branches, making the release process a collaborative effort rather than solely relying on strict commit message conventions.
- **First-Class Monorepo Support:** The tool inherently understands the structure of a monorepo, making it easy to manage dependencies and inter-package relationships during the release process.

While Changesets might require a bit more manual scripting for advanced asset uploading compared to Semantic-Release's plugin ecosystem, its fundamental design for monorepos and its clear, explicit change descriptions make it a superior choice for complex multi-package repositories, especially when combined with the flexibility of GitHub Actions for deployment. It's worth noting that while Changesets offers these benefits, the explicit vs. implicit nature of versioning and changelog generation can be a matter of user preference, but Semantic-Release's approach often proves less suitable for the complexities of monorepos.

---

## Sample Changeset Configuration for Monorepos

- Sample Changeset config: [https://github.com/CutTheCrapTech/email-gateway-cloudflare/blob/main/.changeset/config.json](https://github.com/CutTheCrapTech/email-gateway-cloudflare/blob/main/.changeset/config.json)
- Sample GitHub workflow: [https://github.com/CutTheCrapTech/email-gateway-cloudflare/blob/main/.github/workflows/publish.yaml](https://github.com/CutTheCrapTech/email-gateway-cloudflare/blob/main/.github/workflows/publish.yaml)
- Sample workspace `package.json`: [https://github.com/CutTheCrapTech/email-gateway-cloudflare/blob/main/packages/browser-extensions/package.json](https://github.com/CutTheCrapTech/email-gateway-cloudflare/blob/main/packages/browser-extensions/package.json)

## Understanding `privatePackages` in Monorepos

A common point of confusion in monorepos, especially when using Changesets, revolves around the `privatePackages` configuration in `.changeset/config.json`. While Changesets offers first-class support for monorepos and the concept of private packages, its behavior, particularly regarding versioning and tagging, is not always immediately clear from the documentation.

When a package's `package.json` includes `"private": true`, it signifies that the package is not intended for public npm publication. However, within a monorepo, these private packages often represent internal components or applications (e.g., a Node.js service, a browser extension, a Cloudflare Worker, etc) that still require versioning and release management for internal consistency and deployment tracking. Changesets excels here by allowing you to version and create changelogs for these private packages, even if they never hit a public registry.

The [privatePackages](https://github.com/changesets/changesets/blob/main/docs/versioning-apps.md) object in `config.json` has two important boolean properties:

- `"version": true`: This enables versioning for private packages. When `changeset version` is run, private packages with changes will have their versions bumped and changelogs updated, just like public packages. This is crucial for internal tracking and dependency management within the monorepo. By default, this is set to `true`, meaning that private packages will be versioned unless explicitly configured otherwise.
- `"tag": true`: This instructs Changesets to push Git tags for private packages. While private packages aren't published to npm, creating Git tags (e.g., `@my-scope/my-private-package@1.0.0`) is incredibly useful for linking specific code states to releases, especially for CI/CD pipelines that might trigger deployments based on these tags. This behavior is often under-documented and can be a source of frustration for users trying to set up robust internal release workflows. By default, this is set to `false`, meaning that private packages won't have tags created unless explicitly configured.

The challenge often arises when deploying these private packages. Whether it's a Node.js application, a browser extension, a private nodejs package, or a Cloudflare Worker, these are typically deployed as bundles or compiled artifacts, often requiring specific build steps and asset handling. The default Changesets [action](https://github.com/changesets/action), while excellent for versioning and changelog generation, doesn't inherently provide a mechanism to upload additional deployment assets (like `.zip` files, compiled binaries, or other static assets) alongside the source code. This is a gap that often needs to be bridged with custom CI/CD scripting.

## Changesets and GitHub Actions: A Powerful Release Duo

Changesets, combined with GitHub Actions, provides a robust and transparent release workflow. Here's how it typically works:

1.  **Changeset Creation:** Developers create `.changeset` files to describe their changes (features, bug fixes, breaking changes).
2.  **Version Command:** The `changeset version` command (often run in a CI job) reads these files, bumps package versions, updates `package.json` files, and generates changelogs.
3.  **Publish Command:** The `changeset publish` command then publishes the new versions to npm (for public packages) and creates GitHub releases.

The `changesets/action` GitHub Action simplifies this process significantly. It handles the versioning, publishing, and GitHub release creation based on your `.changeset` files.

### Standardized Asset Uploads with `postrelease` Scripts

While Changesets excels at versioning and creating GitHub releases for your packages, it doesn't inherently provide a mechanism to upload arbitrary build artifacts or assets to these releases. This is a common point where projects often need to implement custom logic. Unlike tools like Semantic-Release which offer extensive plugin ecosystems for this, Changesets encourages a more explicit, script-based approach.

In a monorepo, a powerful and standardized pattern emerges: leveraging `postrelease` scripts within each package's `package.json`.

Here's how this standardized process works in practice:

1.  **Changesets Creates Release:** The `changesets/action` GitHub Action runs, versions the packages, and creates the GitHub release (including source code and changelogs).
2.  **Centralized `postrelease` Trigger:** Immediately after the Changesets action, a dedicated step in the main GitHub Actions workflow (`publish.yaml` in this case) is triggered. This step, often named "Run Post-Release Tasks," checks which packages were just published.
3.  **Package-Specific `postrelease` Execution:** For each published package, the workflow executes its `postrelease` script (if defined) using `pnpm run --filter <package-name> postrelease`. This ensures that only the relevant packages perform their post-release actions.
4.  **`gh release upload` for Assets:** Within each package's `postrelease` script, the `gh release upload` command-line tool is used to attach specific, pre-built artifacts to the newly created GitHub release. This allows each package to define exactly what assets it needs to upload. For example:
    - A Cloudflare Worker package might upload its bundled `worker.js` and a `dist.zip`.
    - A browser extension package might upload browser-specific `.zip` files (e.g., `chrome-extension.zip`, `firefox-extension.zip`) and a configuration file.
    - A core library might upload a `dist.zip` containing its compiled output.

This approach provides a highly flexible yet standardized way to manage release assets. It centralizes the triggering mechanism in the CI workflow while delegating the specific asset-uploading logic to the individual packages, ensuring that each package handles its unique build artifacts appropriately. This explicit control over what gets attached to your releases is a significant advantage.
