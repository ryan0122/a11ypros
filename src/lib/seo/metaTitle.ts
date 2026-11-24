import he from 'he'

// The <title> and social title for a content route: the frontmatter `seoTitle` when there is
// one (falling back to the on-page title), with the brand appended unless it already names it.
export function metaTitle(seoTitle: string | undefined, title: string): string {
  const text = he.decode((seoTitle || title).trim())
  return /a11y pros/i.test(text) ? text : `${text} - A11Y Pros`
}
