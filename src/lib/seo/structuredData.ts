import he from 'he'

// JSON-LD for every content route, built from MDX frontmatter. This replaces the
// RankMath schema frozen at the WordPress migration, which pointed its @ids at
// cms.a11ypros.com, left WebPage.url empty and gave posts no Article node.

export const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

const organization = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'A11Y Pros',
  url: SITE_URL,
  email: 'info@a11ypros.com',
  telephone: '+1-720-722-1775',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/a11ypros_logo_web.png`,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1905 Sherman Street Ste 200 #2042',
    addressLocality: 'Denver',
    addressRegion: 'CO',
    postalCode: '80203',
    addressCountry: 'US',
  },
}

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: 'A11Y Pros',
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: 'en-US',
}

// Extra detail for known authors; anyone else is emitted as a plain Person.
const AUTHORS: Record<string, { jobTitle: string }> = {
  'Ryan Mack': { jobTitle: 'Founder & Certified Web Accessibility Specialist (WAS)' },
}

export interface Crumb {
  name: string
  path: string
}

const absolute = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`)

function breadcrumbList(url: string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: he.decode(crumb.name),
      item: absolute(crumb.path),
    })),
  }
}

function webPage(url: string, name: string, description: string, hasBreadcrumb: boolean) {
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: he.decode(name),
    ...(description && { description }),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
    ...(hasBreadcrumb && { breadcrumb: { '@id': `${url}#breadcrumb` } }),
  }
}

/**
 * Schema for an MDX page. `crumbs` are the trail after Home, ending with this page;
 * pass none for the home page.
 */
export function pageStructuredData({
  path,
  title,
  description,
  crumbs = [],
}: {
  path: string
  title: string
  description: string
  crumbs?: Crumb[]
}) {
  const url = absolute(path)
  const graph: object[] = [organization, website, webPage(url, title, description, crumbs.length > 0)]
  if (crumbs.length > 0) graph.push(breadcrumbList(url, crumbs))
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function articleStructuredData(post: {
  slug: string
  title: string
  description: string
  date: string
  authorName?: string
  image?: string
  schemaType?: string
}) {
  const path = `/blog/${post.slug}`
  const url = absolute(path)
  const title = he.decode(post.title)
  const author =
    post.authorName && post.authorName !== 'A11y Pros Editorial Team'
      ? {
          '@type': 'Person',
          name: post.authorName,
          ...AUTHORS[post.authorName],
          worksFor: { '@id': ORGANIZATION_ID },
        }
      : { '@id': ORGANIZATION_ID }

  const article = {
    '@type': post.schemaType || 'BlogPosting',
    '@id': `${url}#article`,
    headline: title,
    ...(post.description && { description: post.description }),
    datePublished: post.date,
    author,
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
    ...(post.image && { image: post.image.startsWith('http') ? post.image : absolute(post.image) }),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      webPage(url, title, post.description, true),
      breadcrumbList(url, [
        { name: 'Blog', path: '/blog' },
        { name: title, path },
      ]),
      article,
    ],
  }
}

/** Serialize for a <script type="application/ld+json">, escaping `<` so content can't close the tag. */
export function toJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
