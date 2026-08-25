# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/lead-gen site for A11Y Pros (accessibility consulting). Next.js 15 App Router + React 19 + TypeScript, styled with Tailwind 3 and SCSS. Content comes from a **headless WordPress CMS** at `https://cms.a11ypros.com`. Deployed to Netlify; every push to `main` deploys.

Node 22 is required (`.nvmrc`, `engines`, `netlify.toml`).

## Commands

```bash
npm install
npm run dev            # NODE_OPTIONS= is intentional — clears inherited node options
npm run build
npm run lint
npm run build:check    # lint + netlify build — the closest thing to CI locally
npm run netlify:dev    # dev server with Netlify functions/edge emulated
```

There is no test framework in this repo. `lint` + `build` is the verification path.

`scripts/*.mjs` are one-off operational scripts run directly with `node` (not npm scripts) — they publish articles to WordPress and ping the Google Indexing API. `scripts/update-post-seo.mjs` is a scratch script with a hardcoded post ID; treat it as a template, not a stable tool. `scripts/index-url.mjs` needs a `gsc-key.json` service-account file at repo root and no-ops with a warning if it's absent.

## Architecture

### Content pipeline (headless WordPress)

Two data layers, deliberately separate:

- [src/lib/api/pages/dataApi.ts](src/lib/api/pages/dataApi.ts) — `getPageData(slug)` fetches a WP page plus featured media, parent slug, and the `faq-acf-repeater` ACF field. `getPageMetaData(slug)` fetches the RankMath SEO `<head>` blob.
- [src/lib/api/posts/dataApi.ts](src/lib/api/posts/dataApi.ts) — three fetchers with different cost/caching tradeoffs: `getPostsForListing()` (embedded author/media only, `force-cache` + 60s revalidate — use this for lists), `getPosts()` (adds a RankMath call per post, `no-store` — sitemap only), `getPostBySlug()` (single post + RankMath).

SEO metadata is not authored in this repo. RankMath returns a raw HTML `<head>` string; [src/utils/extractJsonLD.ts](src/utils/extractJsonLD.ts) pulls the JSON-LD out of it and routes inject it via `dangerouslySetInnerHTML`. The meta description is regex-extracted from that same blob. FAQ schema is the exception — it is built in Next.js from the ACF repeater rather than trusting RankMath's output (see the comment in [src/app/[...slug]/page.tsx](src/app/[...slug]/page.tsx)).

Note the CMS base URL is handled inconsistently: `NEXT_PUBLIC_CMS_URL` already includes `/wp-json/wp/v2`, but `src/lib/api/posts/dataApi.ts` hardcodes the bare domain and appends the path itself. Check which convention a file uses before adding a fetch.

### Routing

- Dynamic CMS pages are caught directly by `src/app/[...slug]/page.tsx` (it also tolerates a legacy leading `pages` segment if requested).
- The catch-all validates the requested path against the page's real `parentSlug`/`slug` and 404s on mismatch, so CMS page hierarchy must match the URL exactly.
- Paths under `/sales` and `sitemap.xml` are explicitly `notFound()`-ed in the catch-all so the server/`sitemap.ts` handle them.
- Hand-coded routes (`/blog`, `/free-accessibility-audit`, `/free-consultation`, `/services/ada-litigation-support`, `/vpat-estimator`) take precedence over CMS pages of the same name.
- CMS-driven routes set `export const dynamic = 'force-dynamic'`.

### Templates and CMS HTML

`src/components/templates/` holds the three page shells: `PageTemplate` (CMS pages), `ArticleTemplate` (blog posts), `HomeTemplate`. Page bodies arrive as WordPress HTML rendered through `dangerouslySetInnerHTML`.

Because those classes never appear in source, Tailwind can't tree-shake against them: `tailwind.config.ts` adds `wp-classes.txt` to `content` plus an explicit `safelist` and a broad regex pattern. If a class used only inside WordPress content isn't rendering, add it to `wp-classes.txt` or the safelist.

### Middleware

[src/middleware.ts](src/middleware.ts) blocks a long list of scraper/AI-crawler user agents (allowlist for Google/Bing/social unfurlers wins first) and applies a 60 req/min per-IP rate limit. The rate-limit store is a plain in-memory `Map` — it is per-instance and resets on cold start; do not treat it as a real limiter. The matcher excludes `api`, `_next/*`, and `favicon.ico`.

### Forms and lead capture

All forms post to internal API routes that proxy to third parties, so credentials/tokens stay off the client:

- `/api/contact` → WordPress Contact Form 7 endpoint (`NEXT_PUBLIC_CONTACT_URL`). Used by `ContactForm`, the free-audit page, and `VpatEstimatorWidget`. Tolerates CF7 returning HTML instead of JSON and treats it as success.
- `/api/vtiger` → vtiger webform capture at `sales.a11ypros.com`, with hardcoded `__vtrftk`/`publicid` tokens and an explicit field-name mapping. If vtiger form fields change, that mapping is the thing to update.

`netlify/functions/pa11y-scan.js` runs pa11y + a Groq LLM to produce plain-language audit summaries. Its redirect is **commented out in `netlify.toml`** to reduce Netlify function usage, so `/api/scan` is currently dead — re-enable the redirect if wiring the scanner back up.

### Environment

`.env.local` holds `NEXT_PUBLIC_CMS_URL`, `NEXT_PUBLIC_SEO_URL`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_CONTACT_URL`, `NEXT_PUBLIC_WP_AUTH`, `NEXT_PUBLIC_COMING_SOON`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `GROQ_API_KEY`, `NEXT_PUBLIC_HS_PORTAL_ID`, `NEXT_PUBLIC_HS_FORM_GUID`.

`NEXT_PUBLIC_WP_AUTH` is a WordPress Basic-auth credential behind a `NEXT_PUBLIC_` prefix, which means Next inlines it into the client bundle even though it is only ever used server-side. Don't propagate that pattern to new secrets; prefer an unprefixed var for anything server-only.

## Accessibility is the product

This is an accessibility consultancy's own site, so a11y regressions are business-critical, and the repo is set up to enforce that.

Established patterns to preserve:

- Every template renders `<main id="main-content" tabIndex={-1}>`; the skip link in [src/app/layout.tsx](src/app/layout.tsx) targets it.
- [src/hooks/useFocusMainContent.ts](src/hooks/useFocusMainContent.ts) (mounted via `FocusManager`) moves focus to `#main-content` on client-side route changes. It retries with backoff because App Router transitions don't guarantee the node exists yet.
- `ConditionalHeader` suppresses the global header on standalone landing pages (`/free-consultation`, `/free-accessibility-test`).

Non-negotiables enforced across the repo (full detail in [.github/copilot-instructions.md](.github/copilot-instructions.md) and [.github/instructions/](.github/instructions/)): semantic HTML before ARIA, one H1 per page and no skipped levels, full keyboard operability, 4.5:1 text / 3:1 UI contrast, never color alone, focus managed on route changes and dynamic updates, modals trap and restore focus, live regions for dynamic content.

`.claude/agents/` (and the mirrored `.github/agents/`, `.github/skills/`, `.github/prompts/`) contain an installed accessibility agent team — specialist subagents for ARIA, contrast, forms, keyboard, tables, links, alt text, plus document/markdown audit wizards. Prefer delegating UI review to the relevant specialist over ad-hoc checking. [ACCESSIBILITY-AUDIT.md](ACCESSIBILITY-AUDIT.md) at repo root is the latest scored audit with delta tracking against the prior run; read it before starting a new audit and offer delta mode rather than a cold report.

## Conventions

`@/*` maps to `src/*`.

Formatting is inconsistent and unenforced. `.prettierrc` specifies 4-space indent, no semicolons, single quotes — but much of `src/` is 2-space with semicolons and double quotes, and some files mix tabs. Prettier is not wired into a script or a hook. **Match the surrounding file** rather than reformatting it; a formatting-only rewrite produces an unreviewable diff.

SVGs import as React components via `@svgr/webpack` (configured in `next.config.ts`). Hand-authored icon components live in `src/components/icons/`.

SCSS partials in `src/styles/` are aggregated by `main.scss` (`@use`); Tailwind's directives live in `globals.css`. Both are imported by the root layout. Global/WP-editor styling belongs in SCSS; component styling in Tailwind classes.

Remote images are restricted to `cms.a11ypros.com/wp-content/uploads/**` in `next.config.ts` — a new image host needs a `remotePatterns` entry.
