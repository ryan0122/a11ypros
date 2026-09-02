import sanitizeHtml from 'sanitize-html'

/**
 * Safely sanitizes raw HTML generated from local MDX/markdown files,
 * eliminating XSS risks (script tags, event handlers, javascript: URIs)
 * while preserving safe layout elements, CSS classes, ARIA attributes, and component tags.
 */
export function sanitizeMdxContent(rawHtml: string): string {
  return sanitizeHtml(rawHtml, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'div',
      'span',
      'img',
      'iframe',
      'section',
      'aside',
      'header',
      'footer',
      'main',
      'nav',
      'article',
      'figure',
      'figcaption',
      'time',
      'svg',
      'path',
      'pricingcards',
      'PricingCards',
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'className', 'id', 'style', 'aria-*', 'role', 'data-*'],
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
      iframe: ['src', 'width', 'height', 'title', 'frameborder', 'scrolling', 'allow', 'allowfullscreen'],
      svg: ['viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'data-slot'],
      path: ['d', 'fill', 'stroke', 'stroke-linecap', 'stroke-linejoin'],
      th: ['scope', 'align', 'colspan', 'rowspan'],
      td: ['align', 'colspan', 'rowspan'],
    },
    allowedIframeHostnames: ['www.credly.com', 'credly.com', 'www.youtube.com', 'youtube.com'],
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  })
}
