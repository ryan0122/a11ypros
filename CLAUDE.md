# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/lead-gen site for A11Y Pros (accessibility consulting). Next.js 15 App Router + React 19 + TypeScript, styled with Tailwind 3 and SCSS. Content lives in the repo as **MDX files in `src/content/`** (migrated from a headless WordPress CMS at `https://cms.a11ypros.com`, which still hosts some images). Deployed to Netlify; every push to `main` deploys.

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

`scripts/*.mjs` are one-off operational scripts run directly with `node` (not npm scripts):

- `publish.mjs` writes a new post to `src/content/posts/` (copying its image to `public/images/blog/`) and pings the Google Indexing API via `index-url.mjs`, which needs a `gsc-key.json` service-account file at repo root and no-ops with a warning if it's absent.
- `export-wp-pages-to-mdx.mjs` / `export-wp-posts-to-mdx.mjs` performed the one-time WordPress → MDX migration. Don't re-run them; they would overwrite local edits.
- `publish-saas-article.mjs` is a worked example of calling `publishArticle()` for one post; copy it as a template for the next article.
- `update-post-seo.mjs` is broken: it imports `updateRankMathMeta`, which `publish.mjs` no longer exports. Edit `seoDescription` in the post's frontmatter instead.

## Architecture

### Content pipeline (local MDX)

Content is read from the filesystem at request time with `gray-matter`, converted with `remark`/`remark-html`, and passed through `sanitizeMdxContent()` ([src/lib/utils/sanitizeHtml.ts](src/lib/utils/sanitizeHtml.ts)). The loaders keep WordPress-shaped return types (`title.rendered`, `content.rendered`, numeric `id` hashed from the slug) so the templates didn't have to change in the migration.

- **Pages** — `src/content/pages/<slug>.mdx`, loaded by [src/lib/api/pages/dataApi.ts](src/lib/api/pages/dataApi.ts). `getPageData(slug)` matches by filename, falling back to a frontmatter `slug` scan. Frontmatter: `title`, `slug`, `parentSlug`, `featuredImage`, `faqs` (question/answer list), `seoTitle`, `seoDescription`, `rankMathSchema`. `getPageMetaData(slug)` returns `seoDescription` and `rankMathSchema`.
- **Posts** — `src/content/posts/<slug>.mdx`, loaded by [src/lib/api/posts/dataApi.ts](src/lib/api/posts/dataApi.ts) (adds `remark-gfm`). `getPostsForListing()`, `getPosts()` and `getPostBySlug()` all read local files now; the names are WordPress-era. Frontmatter: `title`, `slug`, `date`, `author_name`, `excerpt` (blog listing cards), `featured_image_url`, `seoTitle`, `seoDescription`, `rankMathSchema`.

SEO is authored in frontmatter:

- **Meta description** comes from `seoDescription`; pages fall back to a generic sentence and posts to `excerpt`, so every file should have one. Keep it ≤160 characters, plain text, no HTML entities (the WordPress-era excerpts had `&#8217;`/`[&hellip;]` that leaked into search results).
- **JSON-LD**: pages inject the `rankMathSchema` string (a RankMath export frozen at migration; its `@id`s still point at `cms.a11ypros.com`). Posts store `rankMathSchema` but `ArticleTemplate` doesn't render it, so blog posts currently emit no structured data. FAQ schema is built in Next.js from the `faqs` frontmatter (see [src/app/[...slug]/page.tsx](src/app/[...slug]/page.tsx)).
- New or renamed pages/posts should also be added to [public/llms.txt](public/llms.txt).

Legacy WordPress code that nothing imports: [src/lib/api/posts/route.ts](src/lib/api/posts/route.ts), [src/lib/api/posts/publishPost.ts](src/lib/api/posts/publishPost.ts), [src/utils/extractJsonLD.ts](src/utils/extractJsonLD.ts). Don't build on them.

### Routing

- MDX pages are served by `src/app/[...slug]/page.tsx`, which validates the requested path against the page's `parentSlug`/`slug` and 404s on mismatch, so a page's frontmatter hierarchy must match its URL exactly. The home page is `src/app/page.tsx` reading `home.mdx`.
- Legacy URLs are 301-redirected in `next.config.ts`: `/pages/*` → `/*` and `/home` → `/`. They used to render duplicates of the canonical pages.
- Paths under `/sales` and `sitemap.xml` are explicitly `notFound()`-ed in the catch-all so the server/`sitemap.ts` handle them.
- Hand-coded routes (`/blog`, `/free-accessibility-audit`, `/free-consultation`, `/services/ada-litigation-support`, `/vpat-estimator`) take precedence over MDX pages of the same name. A client-component route needs a sibling `layout.tsx` to set its metadata.
- [src/lib/sitemap.ts](src/lib/sitemap.ts) builds the sitemap from `src/content/` (excluding `home`, `blog`, and thank-you pages); hand-coded routes aren't in it.
- Content routes set `export const dynamic = 'force-dynamic'`.

### Templates and content HTML

`src/components/templates/` holds the three page shells: `PageTemplate` (MDX pages), `ArticleTemplate` (blog posts), `HomeTemplate`. Bodies are rendered as sanitized HTML through `dangerouslySetInnerHTML`, and much of it still carries WordPress block markup and classes from the migration.

Because those classes never appear in source, Tailwind can't tree-shake against them: `tailwind.config.ts` adds `wp-classes.txt` to `content` plus an explicit `safelist` and a broad regex pattern. If a class used only inside content isn't rendering, add it to `wp-classes.txt` or the safelist.

### Middleware

[src/middleware.ts](src/middleware.ts) blocks a long list of scraper/AI-crawler user agents (allowlist for Google/Bing/social unfurlers wins first) and applies a 60 req/min per-IP rate limit. The rate-limit store is a plain in-memory `Map` — it is per-instance and resets on cold start; do not treat it as a real limiter. The matcher excludes `api`, `_next/*`, and `favicon.ico`.

### Forms and lead capture

All forms post to internal API routes that proxy to third parties, so credentials/tokens stay off the client:

- `/api/contact` → emails the submission to `LEAD_INBOX` via Resend (`RESEND_API_KEY`, optional `RESEND_FROM`). Used by `ContactForm`, the free-audit page, and `VpatEstimatorWidget`; each sends a `form-name` that ends up in the email subject. Returns a non-2xx on failure and the clients surface it — never report success without checking `res.ok`. Netlify Forms and WordPress CF7 were both abandoned for lead capture.
- `/api/vtiger` → vtiger webform capture at `sales.a11ypros.com`, with hardcoded `__vtrftk`/`publicid` tokens and an explicit field-name mapping. If vtiger form fields change, that mapping is the thing to update.

`netlify/functions/pa11y-scan.js` runs pa11y + a Groq LLM to produce plain-language audit summaries. Its redirect is **commented out in `netlify.toml`** to reduce Netlify function usage, so `/api/scan` is currently dead — re-enable the redirect if wiring the scanner back up.

### Environment

`.env.local` holds `NEXT_PUBLIC_CMS_URL`, `NEXT_PUBLIC_SEO_URL`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_WP_AUTH`, `NEXT_PUBLIC_COMING_SOON`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `GROQ_API_KEY`, `RESEND_API_KEY`, `LEAD_INBOX`, `RESEND_FROM` (optional), `NEXT_PUBLIC_HS_PORTAL_ID`, `NEXT_PUBLIC_HS_FORM_GUID`.

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

Remote images are restricted to `cms.a11ypros.com/wp-content/uploads/**` in `next.config.ts` — some migrated content still references images there, so keep the entry while WordPress is up. New images belong in `public/images/`; a new remote host needs a `remotePatterns` entry.
