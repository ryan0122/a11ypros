# Web Accessibility Wizard - Agent Memory

## Project: A11Y Pros (a11ypros.com)

### Audit completed: 2026-02-25
Full static code audit written to `/Users/rmack/Projects/a11y-pros/ACCESSIBILITY-AUDIT.md`.
23 issues found (5 critical, 8 serious, 6 moderate, 4 minor). Overall score: 70/100 (C).

### Key architecture facts
- Next.js 14 App Router, TypeScript, Tailwind CSS + SCSS
- CMS: WordPress headless (fetched via REST API from `process.env.NEXT_PUBLIC_CMS_URL`)
- Pages: `/`, `/blog`, `/blog/[slug]`, `/free-accessibility-audit`, `/free-consultation`, `[...slug]` (CMS pages), `/not-found`, `/error`
- Shared form: `ContactForm` (used in Footer, free-consultation, free-accessibility-audit)
- Focus management: `FocusManager` + `useFocusMainContent` hook — moves focus to `#main-content` on route change
- Mobile nav: `MobileNav` — correct focus trap, Escape key, focus restore

### What is already correct (do not re-flag)
- Skip link in layout.tsx targeting `#main-content`
- SPA focus management via FocusManager/useFocusMainContent
- MobileNav: role=dialog, aria-modal, focus trap, Escape key, focus restore
- Mobile menu toggle: aria-expanded, aria-controls, aria-haspopup, sr-only text updates
- Input component: label/htmlFor, useId(), required, aria-describedby on error, focus first error
- TopNav submenu buttons: aria-expanded, aria-controls, aria-label
- aria-current="page" in TopNav and Breadcrumbs
- Breadcrumbs: nav aria-label, ol, aria-current, aria-hidden separators
- html lang="en"
- Page titles via generateMetadata
- autocomplete attrs on ContactForm fields

### Top remaining issues (for next audit comparison)
1. Loader has no role=status / aria-live (all loading overlays)
2. Blog "Read More" links are ambiguous
3. TextArea missing aria-invalid and aria-describedby
4. Pagination Next aria-disabled is INVERTED; disabled states should be span not Link
5. SharePost buttons have no aria-label
6. Heading hierarchy on /free-accessibility-audit (two h2s under h1 misused as marketing copy)
7. Compliance grid hover #737373 fails contrast (~3.1:1 for normal text)
8. error.tsx and not-found.tsx missing main landmark
9. Blog featured image alt uses raw post.title.rendered (HTML entities not decoded; often redundant)
10. Logo links inconsistent accessible names (header="Home", mobile="A11Y Pros")

### User preferences / workflow notes
- User requested full audit without interactive phase-0 Q&A (pre-provided all project info)
- Report written to ACCESSIBILITY-AUDIT.md in project root
- No URL provided; no runtime axe-core scan was run
- No screenshots requested
