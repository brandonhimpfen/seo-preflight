# seo-preflight

[![GitHub Sponsor](https://srv-cdn.himpfen.io/badges/github/github-flat.svg)](https://github.com/sponsors/brandonhimpfen) &nbsp; 
[![Buy Me a Coffee](https://srv-cdn.himpfen.io/badges/buymeacoffee/buymeacoffee-flat.svg)](https://buymeacoffee.com/brandonhimpfen) &nbsp; 
[![Ko-Fi](https://srv-cdn.himpfen.io/badges/kofi/kofi-flat.svg)](https://ko-fi.com/brandonhimpfen) &nbsp; 
[![PayPal](https://srv-cdn.himpfen.io/badges/paypal/paypal-flat.svg)](https://paypal.me/brandonhimpfen)

A lightweight validation layer for checking SEO-critical page fields before publish.

This project helps catch common SEO issues early by validating page metadata and related fields before a page goes live. It is designed for publishing workflows, static site generators, CMS pipelines, and internal content tooling.

It can be used as both a practical utility and a reference pattern for SEO pre-publication checks.

## Why this project exists

Many SEO issues are not technical failures. They are publishing failures.

A page may be published with a missing title, a description that is far too long, a malformed canonical URL, or a slug that does not match the site’s conventions. These problems are usually simple, but they are easy to miss when content moves quickly through a workflow.

Without a preflight layer:

- mistakes are discovered after publish.
- quality checks are inconsistent.
- teams rely on memory instead of validation.
- SEO hygiene becomes harder to maintain at scale.

This package introduces a simple validation step before publish.

## Mental model

Think of the package as a lightweight checkpoint in a publishing pipeline:

`Content -> SEO Preflight -> Publish`

It does not replace a CMS, crawler, or auditing platform.

It validates key page-level fields before they become production issues.

## What is included

- Page validation helpers.
- Multi-page validation helpers.
- Issue reporting with error and warning levels.
- Summary aggregation across results.
- Example usage showing a pre-publish check.
- Test coverage for core validation logic.

## Install

```bash
npm install seo-preflight
```

## Example

```js
import { validatePage } from "seo-preflight";

const result = validatePage({
  title: "Data Size Parser: Convert Human-Readable Sizes into Bytes",
  description: "Parse human-readable data sizes like 10MB, 2GB, and 1TB into bytes.",
  canonical: "https://www.himpfen.com/data-size-parser/",
  slug: "data-size-parser",
  openGraphTitle: "Data Size Parser",
  openGraphDescription: "A lightweight utility for turning human-readable sizes into bytes.",
  robots: "index,follow"
}, {
  canonical: { required: true },
  slug: { required: true },
  requireOpenGraph: true
});

console.log(result);
```

## Validation result

Each validation returns a structured result:

```json
{
  "ok": true,
  "errors": 0,
  "warnings": 0,
  "issues": []
}
```

If a page has issues, the result includes detailed messages with severity, field, and code information.

## What can be validated

The package is intentionally focused on common pre-publish checks. It can validate:

- page title presence and recommended length.
- meta description presence and recommended length.
- canonical URL presence and validity.
- slug format.
- Open Graph title and description presence or length.
- basic robots directive patterns.

Validation rules can be configured to fit different workflows.

## Design Principles

This project is intentionally minimal.

It defines a small validation layer rather than a full SEO platform. The goal is to help teams catch obvious issues early, keep publishing workflows consistent, and make SEO quality easier to enforce.

The design emphasizes:

- Simplicity over abstraction.
- Early validation over post-publish cleanup.
- Structured issue reporting over informal review.
- Small building blocks over large frameworks.

## Non-Goals

This project does not attempt to:

- crawl full websites.
- replace technical SEO auditing tools.
- generate metadata automatically.
- manage rankings, backlinks, or search analytics.

It focuses only on validating page-level SEO inputs before publish.

## Roadmap

Future extensions may include:

- custom rule packs.
- image and alt-text checks.
- social preview validation.
- schema and structured data checks.
- integrations with static site and CMS workflows.

## License

MIT
