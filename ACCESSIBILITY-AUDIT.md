# Accessibility Audit Report

## Project Information

| Field | Value |
|-------|-------|
| Project | A11Y Pros - Accessibility Consulting Website |
| Date | 2026-02-26 |
| Auditor | A11y Agent Team (web-accessibility-wizard) |
| Target standard | WCAG 2.2 AA |
| Framework | Next.js 14 / TypeScript / Tailwind CSS / SCSS |
| Audit method | Combined: runtime axe-core scan (live site) + static code review |
| Live URL | https://a11ypros.com |
| Compared against | Previous audit dated 2026-02-25 |
| Pages audited | `/` (home), `/blog` (listing), `/blog/[slug]` (post), `/free-accessibility-audit`, `/free-consultation`, `/not-found`, `/error`, `[...slug]` (CMS pages) |
| Components audited | ContactForm, ContactPageForm, Input, TextArea, Button, FieldSet, FaqAccordion, Pagination, SharePost, Loader, FocusManager, MobileNav, TopNav, Header, Footer, Breadcrumbs, Services, Compliances, HomeTemplate, PageTemplate |

---

## Executive Summary

| Metric | Previous Audit (2026-02-25) | This Audit (2026-02-26) | Change |
|--------|----|----|------|
| Total issues | 23 | 17 | -6 |
| Critical | 5 | 3 | -2 |
| Serious | 8 | 6 | -2 |
| Moderate | 6 | 5 | -1 |
| Minor | 4 | 3 | -1 |
| Overall score | 70/100 (C) | 79/100 (B) | +9 |

**Estimated remediation effort for remaining issues:** Low-to-medium. Most remaining fixes are targeted and localized to single components.

---

## How This Audit Was Conducted

This report combines two methods:

1. **Runtime axe-core scan (Phase 9):** Automated scan of the live rendered DOM at `https://a11ypros.com`, `/blog`, `/free-consultation`, and `/free-accessibility-audit` using axe-core 4.8.4 with `wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa` rule tags.

2. **Static code review (Phases 1-8):** Complete review of every source file in `/Users/rmack/Projects/a11y-pros/src/` covering structure, ARIA, keyboard, forms, color contrast, images, links, and dynamic content.

Issues confirmed by both methods are marked **high-confidence**. Issues found by one source only are marked accordingly.

---

## Remediation Progress

Comparing against: `ACCESSIBILITY-AUDIT.md` (2026-02-25)

| Status | Count |
|--------|-------|
| Fixed | 6 issues resolved since last audit |
| New | 0 new issues found |
| Persistent | 17 issues remain |
| Regressed | 0 |

Progress: 6 of 23 previous issues fixed (26% reduction). Score improved from 70 to 79.

### Issues Confirmed Fixed

1. **TextArea missing `aria-invalid`** — `TextArea.tsx` now correctly sets `aria-invalid={!!errorText}` and `aria-describedby` when an error is present. Verified in source.
2. **Pagination `aria-disabled` inverted on Next button** — The Next button `span` is now rendered when `currentPage >= totalPages` (previously the condition was inverted). Confirmed correct.
3. **Pagination disabled states use `<span>` not `<Link>`** — Both Previous and Next disabled states correctly render as `<span aria-disabled="true">` instead of a focusable `<Link>`. Confirmed correct.
4. **`aria-current="page"` in TopNav** — `aria-current={isPageActive ? "page" : undefined}` present on all nav links. Confirmed.
5. **Blog post page missing `<main>` landmark** — `blog/[slug]/page.tsx` has `<main id="main-content" tabIndex={-1}>`. Confirmed.
6. **`/not-found.tsx` missing `<main>` landmark** — `not-found.tsx` now has `<main id="main-content" tabIndex={-1} ...>`. Confirmed.

---

## axe-core Runtime Scan Summary

| Page | Violations | Notes |
|------|-----------|-------|
| https://a11ypros.com | 0 | Clean |
| https://a11ypros.com/blog | 0 | Clean |
| https://a11ypros.com/free-consultation | 0 | Clean |
| https://a11ypros.com/free-accessibility-audit | **1** | Missing `<title>` — see Issue #1 below |

axe-core found 1 violation total across 4 pages. All other issues below are identified through static code analysis. axe-core confirms 0 structural or ARIA violations on the live site for pages it can render.

> Note: axe-core detects approximately 20–50% of all accessibility issues. Manual testing remains required for keyboard interaction, screen reader compatibility, and cognitive accessibility concerns.

---

## Critical Issues

### 1. Missing page `<title>` on `/free-accessibility-audit`

- **Severity:** Critical
- **Confidence:** High (confirmed by axe-core scan on live site)
- **Source:** axe-core runtime scan + code review
- **WCAG criterion:** 2.4.2 Page Titled (Level A)
- **Impact:** Screen reader users navigating between browser tabs cannot identify this page. Search engines cannot index it correctly. Browser history entries are anonymous.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/app/free-accessibility-audit/page.tsx`

**Current code:** The page component exports no `generateMetadata` function and no `export const metadata` export. The page is a `'use client'` component that cannot export Next.js metadata.

```tsx
// page.tsx — no metadata export at all
'use client'
export default function FreeAudit() {
  // ...
}
```

**Recommended fix:** Create a separate server component as the page entry and move the `'use client'` logic to a child component.

```tsx
// app/free-accessibility-audit/page.tsx (server component)
import type { Metadata } from "next";
import FreeAuditClient from "./FreeAuditClient";

export const metadata: Metadata = {
  title: "Free Website Accessibility Audit - A11Y Pros",
  description: "Get a free automated accessibility scan of your website powered by Pa11y. Identify WCAG 2.1 AA issues instantly.",
};

export default function FreeAuditPage() {
  return <FreeAuditClient />;
}
```

```tsx
// app/free-accessibility-audit/FreeAuditClient.tsx
'use client'
export default function FreeAuditClient() {
  // all existing component logic here
}
```

---

### 2. Loading overlay blocks entire viewport with no live region announcement

- **Severity:** Critical
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 4.1.3 Status Messages (Level AA), 2.1.1 Keyboard (Level A)
- **Impact:** The `Loader` covers the full viewport (`position: fixed; width: 100vw; height: 98vh; z-index: 9999`) for 500ms on every route change. While it has `role="status"` and an sr-only "Loading..." text, the spinner DIV is not `aria-hidden`, and there is no `aria-live` region to announce the loading state to screen readers who may be mid-interaction. More importantly, the overlay can briefly obscure all content but does not trap focus — a keyboard user tabbing during the animation could accidentally activate links behind the overlay.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/ui/Loader.tsx`, `/Users/rmack/Projects/a11y-pros/src/styles/base/_globals.scss`

**Current code:**
```tsx
return (
  <div className="loading-overlay" role="status">
    <div className="spinner" />
    <span className="sr-only">Loading...</span>
  </div>
);
```

**Recommended fix:**
```tsx
return (
  <div
    className="loading-overlay"
    role="status"
    aria-live="polite"
    aria-label="Page loading"
    aria-busy="true"
  >
    <div className="spinner" aria-hidden="true" />
    <span className="sr-only">Loading page, please wait...</span>
  </div>
);
```

Also add to the SCSS:

```scss
.loading-overlay {
  // existing styles...
  // Prevent interaction with overlaid content
  pointer-events: all;
  inset: 0; // ensures full coverage including top nav gap
}
```

---

### 3. `error.tsx` missing `<main>` landmark and page title

- **Severity:** Critical
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 1.3.1 Info and Relationships (Level A), 2.4.1 Bypass Blocks (Level A), 2.4.2 Page Titled (Level A)
- **Impact:** When a runtime error occurs, the error boundary renders with no `<main>` landmark. Screen reader users cannot jump to main content. The page also has no title, so users cannot identify what page they are on. The raw `error.message` may expose internal stack traces to users.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/app/error.tsx`

**Current code:**
```tsx
"use client";
export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

**Recommended fix:**
```tsx
"use client";
export default function ErrorPage({ error }: { error: Error }) {
  return (
    <main id="main-content" tabIndex={-1} style={{ textAlign: "center", padding: "50px" }}>
      <h1>Something went wrong</h1>
      <p>We encountered an unexpected error. Please try refreshing the page or return to the home page.</p>
      {/* Do not expose raw error.message to users in production */}
    </main>
  );
}
```

Note: Next.js `error.tsx` cannot export `metadata`. Consider adding a `<title>` imperatively via `useEffect` and `document.title`, or restructure using a layout that always provides a title.

---

## Serious Issues

### 4. Blog card links wrap entire card content — ambiguous link text for screen readers

- **Severity:** Serious
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 2.4.4 Link Purpose (In Context) (Level A), 2.4.6 Headings and Labels (Level AA)
- **Impact:** On `/blog` and the home page article list, each post is wrapped in a bare `<a href="/blog/slug">` or `<Link href="/blog/slug">` with no accessible name other than the combined text content of the card (image alt + title + date). Screen readers reading link lists will announce each link as its full card text dump. Additionally, the image in `/blog/page.tsx` has `alt=""` (decorative), but the `<h2>` inside the link contains `dangerouslySetInnerHTML` with unescaped HTML entities from WordPress — screen readers may announce raw HTML entity codes.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/app/blog/page.tsx` lines 91–111, `/Users/rmack/Projects/a11y-pros/src/components/templates/HomeTemplate.tsx` lines 88–113

**Current code (`blog/page.tsx`):**
```tsx
<a href={`/blog/${post.slug}`} className="block no-underline hover:no-underline">
  {post.featured_image_url && (
    <Image src={post.featured_image_url} alt="" ... />
  )}
  <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
  <time ...>{formattedDate}</time>
</a>
```

**Recommended fix:** Decode HTML entities from the title before rendering and add an `aria-label` or restructure so only the heading is the link:

```tsx
import he from "he";

// Option A: Add aria-label with decoded title to the wrapping link
<a
  href={`/blog/${post.slug}`}
  className="block no-underline hover:no-underline"
  aria-label={he.decode(post.title.rendered)}
>
  {/* content */}
</a>

// Option B (recommended): Separate the link from the card and only wrap the heading
<article>
  {post.featured_image_url && (
    <Image src={post.featured_image_url} alt="" aria-hidden="true" ... />
  )}
  <h2>
    <a href={`/blog/${post.slug}`}>
      {he.decode(post.title.rendered)}
    </a>
  </h2>
  <time ...>{formattedDate}</time>
</article>
```

Apply the same fix to `HomeTemplate.tsx` where `<Link href={...}>` wraps the entire `<li>` content.

---

### 5. Blog featured image `alt` uses raw `post.title.rendered` with unescaped HTML entities

- **Severity:** Serious
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 1.1.1 Non-text Content (Level A)
- **Impact:** On the blog post detail page (`/blog/[slug]`), the featured image uses `alt={\`${post.title.rendered}\`}`. WordPress REST API returns titles with HTML entities (e.g., `&#8217;` for apostrophes, `&amp;` for ampersands). Screen readers will announce the raw entity codes rather than the decoded characters. Additionally, the alt text duplicates the `<h1>` immediately below — a screen reader user hears the same text twice in succession (once for the image, once for the heading), creating redundancy.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/app/blog/[slug]/page.tsx` lines 128–136

**Current code:**
```tsx
<Image
  src={post.featured_image_url}
  alt={`${post.title.rendered}`}
  ...
/>
<h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
```

**Recommended fix:** Either decode the alt text and make it non-redundant with the heading, or mark the image as decorative since the heading already conveys the content:

```tsx
// Option A: Decoded, non-redundant alt text
import he from "he";

<Image
  src={post.featured_image_url}
  alt={he.decode(post.title.rendered)}
  ...
/>

// Option B (recommended): Mark as decorative since <h1> is directly below
<Image
  src={post.featured_image_url}
  alt=""
  role="presentation"
  ...
/>
```

---

### 6. Heading hierarchy violations on `/free-accessibility-audit`

- **Severity:** Serious
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)
- **Impact:** The page has three `<h2>` elements that are visually styled as marketing subheadlines but semantically appear at the same level as section headings. The hierarchy is: `<h1>Expert ADA Audit and Remediation Services</h1>` followed immediately by two `<h2>` elements used as taglines in the hero section:
  - `<h2>Over 3,200 ADA website lawsuits...` (marketing tagline)
  - `<h2>Deadline: April 24, 2027...` (marketing subhead)

  Then a third `<h2>Book a Free 30 minute Consultation</h2>` inside the form box — meaning the form heading is at the same structural level as the page hero marketing copy. Screen reader users navigating by heading (`H` key) experience a confusing, flat heading structure with no semantic distinction between the page's main sections.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/app/free-consultation/page.tsx` lines 29–31, 42

**Current code:**
```tsx
<h1 className="text-3xl font-bold leading-tight">
  Expert ADA Audit and Remediation Services
</h1>
<h2 className="flex items-start gap-3 text-xl text-[#d4e300]">
  Over 3,200 ADA website lawsuits filed in 2025 alone...
</h2>
<h2 className='mb-0 mt-8'>Deadline: April 24, 2027...</h2>
// ...
<h2 className="mt-0 mb-4 text-3xl font-bold text-gray-900 text-center">
  Book a Free 30 minute Consultation
</h2>
```

**Recommended fix:** Use `<p>` or styled spans for the marketing taglines and reserve `<h2>` for genuine section headings:

```tsx
<h1>Expert ADA Audit and Remediation Services</h1>
{/* Marketing taglines — not headings */}
<p className="flex items-start gap-3 text-xl text-[#d4e300]">
  Over 3,200 ADA website lawsuits filed in 2025 alone. Protect your business...
</p>
<p className='mb-0 mt-8 font-semibold'>Deadline: April 24, 2027 for digital accessibility compliance</p>
// ...
{/* This is the first real section heading */}
<h2 className="mt-0 mb-4 text-3xl font-bold text-gray-900 text-center">
  Book a Free 30 minute Consultation
</h2>
```

---

### 7. Compliance grid hover/focus state fails color contrast

- **Severity:** Serious
- **Confidence:** High (code review + color calculation)
- **Source:** Static code review
- **WCAG criterion:** 1.4.3 Contrast (Minimum) (Level AA), 1.4.11 Non-text Contrast (Level AA)
- **Impact:** When any compliance grid card (WCAG, ADA, Section 508, ACA, AODA, EN 301 549) is hovered or focused, the background transitions to `#737373`. The cards contain white (`#ffffff`) heading text. The contrast ratio of `#ffffff` on `#737373` is approximately **4.6:1**, which does pass for normal text at 4.5:1. However, `#737373` is also used as the background when focus is applied — and the card description text (`<p>` elements) inside the compliance blocks is `#ffffff` in smaller sizes, which may only pass at the 4.5:1 threshold for large text (18pt/14pt bold). More critically, when the hover color `#737373` replaces the original brand colors (e.g., `#6B660D` for ACA, ratio is even lower), the focus indicator change itself fails 1.4.11 (minimum 3:1 contrast between focused and unfocused state for non-text components). The transition from `#6B660D` to `#737373` provides only ~1.3:1 component contrast change, effectively making the focus state visually indistinguishable from the unfocused state for users with low vision.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/styles/pages/_home.scss` lines 66–71

**Current code:**
```scss
.compliance-grid {
  a:hover, a:focus {
    background: #737373;
    text-decoration: none;
  }
}
```

**Recommended fix:** Replace the gray hover state with a high-contrast focus indicator that meets 3:1 against the card's brand background:

```scss
.compliance-grid {
  a:hover {
    opacity: 0.85;
    text-decoration: none;
  }
  a:focus-visible {
    outline: 3px solid #d4e300; // Accent yellow, high contrast
    outline-offset: 2px;
    background: inherit; // Keep original brand color, don't override it
    text-decoration: none;
  }
}
```

---

### 8. `SharePost` buttons do not reliably pass `aria-label` to the rendered `<button>` element

- **Severity:** Serious
- **Confidence:** Medium (code review — depends on `react-share` library internals)
- **Source:** Static code review
- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A)
- **Impact:** On blog post pages, the four share buttons (Facebook, LinkedIn, X/Twitter, Email) use `react-share` components. While `aria-label` props are passed in the JSX, `react-share` may not forward these props to the underlying `<button>` element — this is a known issue with older versions of the library. The icon images inside each button have no `alt` text. If `aria-label` is not forwarded, keyboard and screen reader users hear "button" with no accessible name, making the share interface entirely unusable.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/ui/SharePost.tsx`

**Current code:**
```tsx
<FacebookShareButton url={url} aria-label="Share on Facebook">
  <FacebookIcon className="w-6 h-6" />
</FacebookShareButton>
```

**Recommended fix:** Verify that `react-share` forwards the `aria-label` prop by inspecting the rendered HTML. If it does not, wrap each button or use the lower-level `ShareButton` base component:

```tsx
// Verify rendering, then if needed:
<FacebookShareButton url={url}>
  <FacebookIcon className="w-6 h-6" aria-hidden="true" />
  <span className="sr-only">Share on Facebook</span>
</FacebookShareButton>
```

---

### 9. Logo accessible names are inconsistent between Header and MobileNav

- **Severity:** Serious
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 2.4.6 Headings and Labels (Level AA), 3.2.4 Consistent Identification (Level AA)
- **Impact:** The logo link in `Header.tsx` has `<span className="sr-only">Home</span>` (accessible name: "Home"), while the same logo in `MobileNav.tsx` has `<span className="sr-only">A11Y Pros</span>` (accessible name: "A11Y Pros"). The same functional link — go to the home page — is announced differently depending on which menu state is active. This violates consistent identification and confuses users who rely on screen readers.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/layout/Header.tsx` line 18, `/Users/rmack/Projects/a11y-pros/src/components/layout/MobileNav.tsx` line 98

**Current code:**
```tsx
// Header.tsx
<Link href="/" className="logo ...">
  <IconLogo />
  <span className="sr-only">Home</span>
</Link>

// MobileNav.tsx
<Link href="/" className="logo ...">
  <IconLogo color="#001d2f"/>
  <span className="sr-only">A11Y Pros</span>
</Link>
```

**Recommended fix:** Standardize to a consistent accessible name. The SVG logo already has `aria-label="A11Y Pros Logo"`, so the best combined approach is:

```tsx
// Both Header.tsx and MobileNav.tsx — use identical accessible name
<Link href="/" aria-label="A11Y Pros – go to homepage">
  <IconLogo aria-hidden={true} />
</Link>
```

Note: With this fix, also pass `aria-hidden={true}` to `IconLogo` to suppress the SVG's own `aria-label` which would otherwise double-announce.

---

## Moderate Issues

### 10. `FaqAccordion` `<summary>` uses `outline: none` via global style — only partially offset by custom focus ring

- **Severity:** Moderate
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 2.4.7 Focus Visible (Level AA), 2.4.11 Focus Appearance (WCAG 2.2 Level AA)
- **Impact:** The global SCSS sets `summary:focus { outline: none; box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #001d2f; }`. The custom box-shadow focus ring is a good pattern, but only triggers on `:focus`, not `:focus-visible`. This means keyboard-only users always see the box-shadow ring, which is correct — but it also means mouse users see a ring when clicking accordion items. This is a UX concern, not a critical a11y failure. More importantly, WCAG 2.2 SC 2.4.11 requires a focus indicator that has at minimum a 2px perimeter and 3:1 contrast. The dark blue `#001d2f` outer ring on the off-white background `#f9f8f2` provides approximately **14.7:1** contrast — this passes. However, the `outline: none` is a code smell that should be replaced with `outline-style: none` or a `:focus-visible` pattern to be safer across browsers and AT combinations.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/styles/base/_globals.scss` line 11–16

**Recommended fix:**
```scss
// Replace the current rule:
a:focus, summary:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #001d2f;
}

// With focus-visible to avoid showing ring on mouse click:
a:focus-visible, summary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #001d2f;
}
// Also retain :focus for backward-compat with browsers that don't support :focus-visible
a:focus:not(:focus-visible), summary:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}
```

---

### 11. `ObfuscatedEmail` in Footer is a `<button>` that opens `mailto:` — pattern breaks expected semantics

- **Severity:** Moderate
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A), 3.2.1 On Focus (Level A)
- **Impact:** The `ObfuscatedEmail` component in `Footer.tsx` renders a `<button type="button">` with text "Email Us" that, on click, sets `window.location.href = "mailto:..."`. Screen readers announce this as a "button" — but the standard expectation for a button is to perform an action within the page, not navigate. An `<a href="mailto:...">` element would correctly announce as a "link" and convey the correct interaction model. The mailto: approach also gives no user warning, whereas a link clearly indicates it will open an email client. The obfuscation can be kept with a `<a>` element using JavaScript for href construction.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/layout/Footer.tsx` lines 10–24

**Current code:**
```tsx
const ObfuscatedEmail = () => {
  const email = 'info@a11ypros.com';
  const encoded = btoa(email);
  const handleClick = () => {
    const decoded = atob(encoded) as string;
    window.location.href = `mailto:${decoded}`;
  };
  return (
    <button type="button" onClick={handleClick} className="email-link">
      Email Us
    </button>
  );
};
```

**Recommended fix:**
```tsx
const ObfuscatedEmail = () => {
  const email = 'info@a11ypros.com';
  const encoded = btoa(email);
  const getHref = () => `mailto:${atob(encoded)}`;

  return (
    <a
      href="#"
      className="email-link"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = getHref();
      }}
    >
      Email Us
    </a>
  );
};
```

---

### 12. `Input` component missing `aria-invalid` attribute

- **Severity:** Moderate
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 3.3.1 Error Identification (Level A), 4.1.2 Name, Role, Value (Level A)
- **Impact:** The `TextArea` component correctly sets `aria-invalid={!!errorText}`. The `Input` component does not. Screen reader users who tab to an errored input field will not hear the invalid state announced. They must discover the error through the error message text alone, which only works if they have already focused the field and their screen reader reads the `aria-describedby` content. Without `aria-invalid`, some screen readers do not trigger the error description unless specifically navigating to it.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/forms/Input.tsx` lines 30–38

**Current code:**
```tsx
<input
  ref={ref}
  id={inputId}
  type={type}
  required={required}
  className={errorText ? "error" : ""}
  aria-describedby={errorText ? errorId : undefined}
  {...rest}
/>
```

**Recommended fix:**
```tsx
<input
  ref={ref}
  id={inputId}
  type={type}
  required={required}
  className={errorText ? "error" : ""}
  aria-invalid={errorText ? true : undefined}
  aria-describedby={errorText ? errorId : undefined}
  {...rest}
/>
```

---

### 13. `IconHomeHero` SVG has conflicting `aria-hidden="true"` and `role="img"` attributes

- **Severity:** Moderate
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A)
- **Impact:** The `IconHomeHero` SVG component sets both `aria-hidden="true"` and `role="img"` simultaneously. These attributes are contradictory: `aria-hidden="true"` hides the element from the accessibility tree entirely, while `role="img"` declares it as an image that needs an accessible name. The simultaneous presence creates confusing behavior across different AT implementations — some will honor `aria-hidden` and hide it, others may expose an image with no name. Since the SVG is purely decorative, `aria-hidden="true"` is correct and `role="img"` should be removed.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/icons/IconHomeHero.tsx` lines 31–34

**Current code:**
```tsx
<svg
  aria-hidden="true"
  focusable="false"
  role="img"
  ...
>
```

**Recommended fix:** Remove `role="img"` since `aria-hidden="true"` is correct for a purely decorative illustration:

```tsx
<svg
  aria-hidden="true"
  focusable="false"
  // role="img" removed — aria-hidden already handles this correctly
  ...
>
```

---

### 14. Ellipsis `...` in `Pagination` is not announced meaningfully to screen readers

- **Severity:** Moderate
- **Confidence:** Medium (code review)
- **Source:** Static code review
- **WCAG criterion:** 1.3.1 Info and Relationships (Level A)
- **Impact:** When many blog pages exist and the current page is not near the start or end, the pagination renders literal `...` in `<span>` elements. Screen readers will announce "dot dot dot" or "ellipsis" which conveys no useful information. Users navigating pagination by reading the list of links will not understand that pages have been omitted.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/components/ui/Pagination.tsx` lines 94–103

**Current code:**
```tsx
if (page === '...') {
  return (
    <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
      ...
    </span>
  )
}
```

**Recommended fix:**
```tsx
if (page === '...') {
  return (
    <span
      key={`ellipsis-${index}`}
      className="px-2 py-2 text-gray-500"
      aria-hidden="true"
    >
      ...
    </span>
  )
}
```

Adding `aria-hidden="true"` removes the meaningless announcement. The pagination landmark with its label "Blog Pagination" plus the adjacent numbered page links provides sufficient context about the range. Alternatively, add a visually hidden span with screen-reader-only text like `<span className="sr-only">More pages</span>`.

---

## Minor Issues

### 15. `<section>` elements in `/free-accessibility-audit` lack accessible names

- **Severity:** Minor
- **Confidence:** Medium (code review)
- **Source:** Static code review
- **WCAG criterion:** 1.3.6 Identify Purpose (WCAG 2.1 Level AAA — advisory at AA), best practice
- **Impact:** The `/free-accessibility-audit` page has four `<section>` elements with no `aria-label` or `aria-labelledby`. Landmark regions without names are not individually reachable via screen reader landmark navigation. Users navigating by landmark regions (Forms mode, Regions list in JAWS/NVDA) will see multiple unnamed "region" entries. This is not a WCAG AA failure but reduces usability for AT users.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/app/free-accessibility-audit/page.tsx`

**Recommended fix:** Add `aria-label` to landmark sections:
```tsx
<section aria-label="Free Consultation Hero" className="bg-[#001d2f] text-white">
<section aria-label="Free Website Accessibility Test" className="bg-[#001d2f] text-white">
<section aria-label="What this scan does" className="mx-auto max-w-6xl p-8">
```

---

### 16. `prefers-reduced-motion` not respected for spinner animation

- **Severity:** Minor
- **Confidence:** High (code review)
- **Source:** Static code review
- **WCAG criterion:** 2.3.3 Animation from Interactions (WCAG 2.1 Level AAA — advisory), best practice; SC 2.3.1 Three Flashes Level A
- **Impact:** The loading spinner uses a continuous CSS `animation: spin 0.8s linear infinite`. Users with `prefers-reduced-motion: reduce` set in their OS will still see the spinning animation. While vestibular disorders may not be triggered by a small spinner, best practice (and increasingly expected) is to respect the user's OS motion preference.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/styles/base/_globals.scss` lines 71–85

**Recommended fix:**
```scss
.loading-overlay .spinner {
  width: 100px;
  height: 100px;
  border: 5px solid #0E816833;
  border-top: 5px solid #0E8168;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    // Show a static indicator instead
    border-top-color: #0E8168;
    opacity: 0.8;
  }
}
```

---

### 17. `skip-link` uses `outline: none` on `:focus` without explicit replacement in that rule

- **Severity:** Minor
- **Confidence:** Medium (code review — interaction with global `a:focus-visible` rule)
- **Source:** Static code review
- **WCAG criterion:** 2.4.7 Focus Visible (Level AA)
- **Impact:** The `.skip-link:focus` rule moves the link into view (`top: 10px`) but does not define a visible focus indicator — it inherits the box-shadow from the global `a:focus` rule in `_globals.scss`. This should work in practice, but the dependency is fragile. If the global rule changes, the skip link loses its focus indicator. Making the focus style explicit on the skip link is best practice.
- **Location:** `/Users/rmack/Projects/a11y-pros/src/styles/base/_globals.scss` lines 47–49

**Recommended fix:**
```scss
.skip-link:focus {
  top: 10px;
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #001d2f; // Explicit, not inherited
}
```

---

## What Passed

The following areas are implemented correctly and require no changes:

### Structure and Navigation
- `<html lang="en">` — correctly set on root element
- Page titles — all pages except `/free-accessibility-audit` export correct `generateMetadata`
- Skip navigation link — present in `layout.tsx`, correctly styled to appear on focus, targets `#main-content`
- All page components have `<main id="main-content" tabIndex={-1}>` — enables skip link targeting and SPA focus management
- Landmark regions — `<header>`, `<nav>`, `<main>`, `<footer>` present on all templated pages
- Breadcrumbs — correct `<nav aria-label="Breadcrumb">`, `<ol>`, `aria-current="page"`, `aria-hidden="true"` on separators

### Keyboard and Focus Management
- SPA route change focus management — `FocusManager` + `useFocusMainContent` hook correctly moves focus to `#main-content` on navigation
- Mobile menu — `role="dialog"`, `aria-modal="true"`, programmatic focus to close button on open, focus trap (Tab/Shift+Tab cycling), Escape key closes, focus restored to trigger button on close
- Mobile menu toggle — `aria-expanded`, `aria-controls="mobileMenu"`, `aria-haspopup="dialog"`, sr-only text updates with state
- TopNav submenu — `aria-expanded`, `aria-controls`, `aria-label` on expand buttons; submenu closes on route change

### Forms
- `Input` component — correct `<label htmlFor>`, `useId()` for stable IDs, `required` attribute, `aria-describedby` referencing error span when error present, focus moved to first errored field on failed submission
- `TextArea` component — correct `<label htmlFor>`, `aria-invalid`, `aria-describedby` on error (fixed in last sprint)
- `FieldSet` component — correct `<fieldset>` with `<legend>`
- `ContactForm` — `autocomplete` attributes on all relevant fields (`given-name`, `family-name`, `organization`, `email`, `tel`)
- Form error announcement — errors set state that renders associated `aria-describedby` spans; first errored field receives focus

### ARIA Correctness
- `aria-current="page"` — correctly applied in `TopNav` and `Breadcrumbs`
- Pagination — `aria-current="page"` on active page, `aria-label` on all page links, disabled states use non-interactive `<span aria-disabled="true">`
- Decorative icons — `aria-hidden="true"` consistently applied across all icon components
- Decorative logo in footer — `aria-hidden={true}` on `<div>` wrapper

### Semantic HTML
- Blog post — `<article>` element wrapping post content
- Blog post sidebar — `<aside>` with author/date/share info
- Contact info — `<address>` element correctly used in `ContactPageForm` and Footer
- FAQ accordion — uses native `<details>`/`<summary>` for semantically correct, keyboard-accessible disclosure without custom ARIA
- Blog listing — uses `<ul>` + `<li>` for post grid (correct for a list of items)
- Pagination — `<nav aria-labelledby="pagination">` with hidden `<h2 id="pagination">` for landmark identification

### Color Contrast
- Primary text `#001d2f` on `#f9f8f2` background — approximately **15.8:1** — passes
- Header white text `#ffffff` on `#001d2f` — approximately **14.7:1** — passes
- Primary green `#0E8168` on white — approximately **4.6:1** — passes AA for normal text
- Error red `#da3940` — checked on white backgrounds — approximately **5.0:1** — passes
- Skip link: white text on `#0E8168` — approximately **4.6:1** — passes

---

## Accessibility Scorecard

| Page / Component | Score | Grade | Critical | Serious | Moderate | Minor |
|-----------------|-------|-------|----------|---------|----------|-------|
| `/` (Home) | 89/100 | B | 0 | 1 | 1 | 1 |
| `/blog` (Listing) | 85/100 | B | 0 | 1 | 1 | 0 |
| `/blog/[slug]` (Post) | 84/100 | B | 0 | 2 | 0 | 0 |
| `/free-accessibility-audit` | 66/100 | D | 1 | 1 | 1 | 1 |
| `/free-consultation` | 75/100 | C | 0 | 2 | 1 | 0 |
| `/error` | 72/100 | C | 1 | 0 | 0 | 0 |
| `[...slug]` CMS pages | 88/100 | B | 0 | 0 | 1 | 1 |
| Shared components | 80/100 | B | 1 | 2 | 3 | 2 |
| **Overall Average** | **79/100** | **B** | **3** | **6** | **5** | **3** |

---

## Cross-Page Patterns

### Systemic Issues (found on every page)

None identified — previous systemic issues (skip link, focus management, landmark structure) are now resolved.

### Component-Level Issues (fix once, fix everywhere)

| Component | Issue | Pages Affected | ROI |
|-----------|-------|----------------|-----|
| `Input` (forms/Input.tsx) | Missing `aria-invalid` | All pages with ContactForm: `/`, `/blog`, `/free-consultation`, `/free-accessibility-audit`, CMS contact pages | High |
| `SharePost` | `aria-label` forwarding to `react-share` unverified | All `/blog/[slug]` pages | Medium |
| `IconHomeHero` | Conflicting `aria-hidden` + `role="img"` | `/`, `/free-consultation` | Low |

### Page-Specific Issues

| Page | Issue |
|------|-------|
| `/free-accessibility-audit` | Missing page `<title>` (axe-core confirmed) |
| `/free-consultation` | Heading hierarchy violation (H2s used as marketing taglines) |
| `/blog/[slug]` | Featured image alt contains raw HTML entities, redundant with H1 |
| `/error` | Missing `<main>` landmark, missing page title, raw error.message exposed |

---

## Findings by Rule

| WCAG Criterion | Severity | Components/Pages | Instances |
|---------------|----------|------------------|-----------|
| 2.4.2 Page Titled (A) | Critical | `/free-accessibility-audit`, `/error` | 2 |
| 4.1.3 Status Messages (AA) | Critical | `Loader` | 1 |
| 1.3.1 Info and Relationships (A) | Critical/Serious | `error.tsx`, heading hierarchy | 2 |
| 2.4.4 Link Purpose (A) | Serious | `blog/page.tsx`, `HomeTemplate.tsx` | 2 pages |
| 1.1.1 Non-text Content (A) | Serious | `/blog/[slug]` featured image | 1 |
| 2.4.6 Headings and Labels (AA) | Serious | `/free-consultation` | 1 |
| 1.4.3 Contrast (AA) | Serious | Compliance grid hover state | 6 cards |
| 4.1.2 Name, Role, Value (A) | Serious/Moderate | SharePost, logo links, `Input`, `IconHomeHero` | 4 |
| 3.2.4 Consistent Identification (AA) | Serious | Logo accessible name inconsistency | 1 |
| 3.3.1 Error Identification (A) | Moderate | `Input` missing `aria-invalid` | All forms |
| 1.3.1 Info and Relationships (A) | Moderate | Pagination ellipsis | 1 |
| 2.4.7 Focus Visible (AA) | Minor | `summary` focus, skip link | 2 |

---

## Page Metadata Dashboard

| Property | Present | Missing | Notes |
|----------|---------|---------|-------|
| Page Title (`<title>`) | 7 pages | 1 page | `/free-accessibility-audit` confirmed missing by axe-core |
| Language (`<html lang>`) | All | 0 | `lang="en"` in root layout |
| Viewport Meta | All | 0 | Via Next.js default |
| Skip Navigation Link | All | 0 | In root layout |
| Main Landmark | 7 pages | 1 page | `/error` still missing `<main>` |
| `<html lang>` | All | 0 | Pass |

---

## Framework-Specific Notes (Next.js 14 App Router)

- **`'use client'` prevents metadata export:** The `/free-accessibility-audit` page is a client component (`'use client'`) and cannot export `generateMetadata`. This is the root cause of the missing `<title>`. The fix requires splitting into a server wrapper + client component — a common Next.js App Router pattern. See Issue #1.
- **`dangerouslySetInnerHTML` and HTML entities:** WordPress REST API returns titles with encoded HTML entities. The `he.decode()` library is already imported on several components but not used in the `alt` attribute context in `blog/[slug]/page.tsx`. Consistent use of `he.decode()` for all user-facing CMS text is recommended.
- **React Server Components and `useId`:** The `Input` and `TextArea` components use `useId()` correctly for generating stable IDs server-side. This is the correct pattern.
- **`tabIndex={-1}` on `<main>`:** Correctly applied across all page components to support focus management. Next.js App Router does not automatically manage focus on route transitions, so the manual implementation is required and correct.
- **`requestAnimationFrame` double-wrap in `useFocusMainContent`:** The double `rAF` is a common technique to wait for the DOM to commit. This is correct for the SPA focus management use case.

---

## Recommended Testing Setup

### Automated Testing

Add `@axe-core/react` for development-time warnings:

```bash
npm install --save-dev @axe-core/react
```

```tsx
// app/layout.tsx (or a separate DevTools component)
if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then(({ default: axe }) => {
    axe(React, ReactDOM, 1000);
  });
}
```

### CI Pipeline Recommendation

Add to `.github/workflows/accessibility.yml`:

```yaml
name: Accessibility Audit
on: [push, pull_request]
jobs:
  axe:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - run: npx serve@latest out &
      - run: sleep 5
      - run: npx @axe-core/cli http://localhost:3000 --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
```

### Manual Testing Checklist (Priority Order)

1. **Fix Issue #1 first** — then re-run `npx @axe-core/cli https://a11ypros.com/free-accessibility-audit` to verify the title is present on the live site.
2. **Keyboard-only navigation test:** Tab through the full contact form. Verify: all fields reachable, error states announced, submission focus moves to first error.
3. **Blog share buttons:** Inspect rendered HTML of SharePost on a blog post. Confirm `aria-label` is on the `<button>` element in the DOM, not just on the React wrapper.
4. **Compliance grid focus test:** Tab to each compliance card. Verify the focus indicator is visible and has sufficient contrast against the card's background color.

### Screen Reader Testing Guide

| Screen Reader | Browser | Priority | Key Test Areas |
|--------------|---------|----------|----------------|
| VoiceOver | Safari (macOS) | High | Blog card links, form validation, mobile nav |
| NVDA | Firefox | High | Heading structure, landmark navigation, Loader announcement |
| JAWS | Chrome | Medium | Contact form submission flow, pagination |

For NVDA/JAWS: Press `H` to navigate headings — verify `/free-consultation` hierarchy after fix. Press `R` to navigate landmarks — verify all pages have distinct, named landmark regions.

---

## Next Steps (Priority Order)

1. **Issue #1 (Critical):** Split `/free-accessibility-audit` into server wrapper + client component to restore `generateMetadata`.
2. **Issue #3 (Critical):** Add `<main>` landmark and user-friendly message to `error.tsx`.
3. **Issue #12 (Moderate):** Add `aria-invalid` to `Input` component — 1-line fix, high ROI across all forms.
4. **Issue #7 (Serious):** Replace compliance grid hover/focus with a proper `:focus-visible` ring that preserves brand background colors.
5. **Issue #9 (Serious):** Standardize logo accessible names between `Header.tsx` and `MobileNav.tsx`.
6. **Issue #4 (Serious):** Restructure blog card links so only the heading text is the link text.
7. **Issue #5 (Serious):** Apply `he.decode()` to featured image alt text on blog posts.
8. **Issue #6 (Serious):** Change marketing taglines on `/free-consultation` from `<h2>` to `<p>`.
9. **Issue #8 (Serious):** Verify SharePost `aria-label` forwarding in rendered HTML.
10. **Issue #2 (Critical):** Enhance Loader with `aria-live="polite"` and `aria-busy`, add `prefers-reduced-motion` support.
