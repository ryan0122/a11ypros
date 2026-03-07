# Web Accessibility Wizard - Agent Memory

## Project: A11Y Pros (a11ypros.com)

### Audit completed: 2026-02-26 (second audit — runtime + code review)
Full audit written to `/Users/rmack/Projects/a11y-pros/ACCESSIBILITY-AUDIT.md`.
17 issues found (3 critical, 6 serious, 5 moderate, 3 minor). Overall score: 79/100 (B).
Previous audit (2026-02-25): 23 issues, 70/100. 6 issues fixed in the sprint.

### Key architecture facts
- Next.js 14 App Router, TypeScript, Tailwind CSS + SCSS
- CMS: WordPress headless (fetched via REST API from `process.env.NEXT_PUBLIC_CMS_URL`)
- Pages: `/`, `/blog`, `/blog/[slug]`, `/free-accessibility-audit`, `/free-consultation`, `[...slug]` (CMS pages), `/not-found`, `/error`
- Shared form: `ContactForm` (used in Footer, free-consultation, free-accessibility-audit)
- Focus management: `FocusManager` + `useFocusMainContent` hook — moves focus to `#main-content` on route change
- Mobile nav: `MobileNav` — correct focus trap, Escape key, focus restore

### What is confirmed correct (do not re-flag)
- Skip link in layout.tsx targeting `#main-content`
- SPA focus management via FocusManager/useFocusMainContent
- MobileNav: role=dialog, aria-modal, focus trap, Escape key, focus restore
- Mobile menu toggle: aria-expanded, aria-controls, aria-haspopup, sr-only text updates
- Input component: label/htmlFor, useId(), required, aria-describedby on error, focus first error
- TextArea: aria-invalid, aria-describedby (FIXED in previous sprint)
- Pagination disabled states: span not Link (FIXED in previous sprint)
- Pagination aria-disabled inversion (FIXED)
- TopNav submenu buttons: aria-expanded, aria-controls, aria-label
- aria-current="page" in TopNav and Breadcrumbs
- Breadcrumbs: nav aria-label, ol, aria-current, aria-hidden separators
- html lang="en"
- Page titles via generateMetadata (all pages except /free-accessibility-audit)
- autocomplete attrs on ContactForm fields
- /not-found.tsx has main landmark (FIXED)
- /blog/[slug]/page.tsx has main landmark (FIXED)

### Top remaining issues (for next audit comparison)
1. [CRITICAL] /free-accessibility-audit missing <title> — page is 'use client', cannot export metadata. Needs server wrapper + FreeAuditClient child component split.
2. [CRITICAL] Loader: has role=status but no aria-live, spinner div not aria-hidden, no prefers-reduced-motion support
3. [CRITICAL] error.tsx: no <main> landmark, no page title, exposes raw error.message
4. [SERIOUS] Blog card links wrap entire card — ambiguous for screen reader link lists; dangerouslySetInnerHTML with undecoded HTML entities in h2
5. [SERIOUS] Blog /[slug] featured image alt uses raw post.title.rendered (HTML entities not decoded, redundant with h1)
6. [SERIOUS] /free-consultation heading hierarchy: h2s used as marketing taglines in hero
7. [SERIOUS] Compliance grid hover/focus: #737373 background barely changes vs brand colors; focus indicator fails 1.4.11 for some cards
8. [SERIOUS] SharePost aria-label forwarding to react-share not verified in DOM
9. [SERIOUS] Logo accessible names inconsistent: Header="Home", MobileNav="A11Y Pros"
10. [MODERATE] Input component missing aria-invalid (TextArea has it, Input does not — 1-line fix)
11. [MODERATE] ObfuscatedEmail in Footer uses <button> for mailto — should be <a>
12. [MODERATE] IconHomeHero has both aria-hidden=true and role=img — contradictory
13. [MODERATE] Pagination ellipsis "..." not aria-hidden — announces as "dot dot dot"
14. [MINOR] Section elements in /free-accessibility-audit lack aria-label
15. [MINOR] Spinner animation not respecting prefers-reduced-motion
16. [MINOR] summary:focus uses outline:none without focus-visible upgrade
17. [MINOR] skip-link focus indicator inherited, not explicit

### axe-core runtime scan results (2026-02-26)
- https://a11ypros.com: 0 violations
- https://a11ypros.com/blog: 0 violations
- https://a11ypros.com/free-consultation: 0 violations
- https://a11ypros.com/free-accessibility-audit: 1 violation (document-title, confirmed missing)

### User preferences / workflow notes
- User requested full audit with runtime scan (URL provided) + code review
- Report written to ACCESSIBILITY-AUDIT.md in project root
- No screenshots requested
- axe-core CLI used: npx @axe-core/cli <URL> --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
- Note: axe-core --save flag requires relative path workaround (absolute paths doubled)

### Technical notes
- axe-core --save writes relative to CWD, not absolute path. Use: cd /project && npx @axe-core/cli <url> --save SCAN.json
- The 'use client' constraint in Next.js App Router means pages needing client hooks cannot export generateMetadata — must split into server page + client child component
