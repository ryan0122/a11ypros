import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { getPosts } from '@/lib/api/posts/dataApi'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'
const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages')

// Public pages built in code under src/app, which the MDX scan below can't see. Leave out
// thank-you pages, test pages and anything marked noindex.
const CODE_ROUTES = [
  '/services/accessibility-monitoring',
  '/services/ada-litigation-support',
  '/book-a-demo',
  '/free-accessibility-scan',
  '/free-consultation',
  '/vpat-estimator',
  '/blog',
]

export interface SitemapUrl {
  url: string
  path: string
  /** 'route' is a page built in code under src/app rather than from an MDX file. */
  type: 'page' | 'post' | 'home' | 'route'
  slug: string
}

export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  try {
    const localPosts = await getPosts()
    const sitemapUrls: SitemapUrl[] = [
      {
        url: BASE_URL,
        path: '/',
        type: 'home',
        slug: '',
      },
    ]

    // Read local MDX pages from src/content/pages/
    if (fs.existsSync(PAGES_DIR)) {
      const fileNames = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      const excludedSlugs = ['contact-us-thank-you', 'thank-you', 'home', 'blog']

      for (const fileName of fileNames) {
        const filePath = path.join(PAGES_DIR, fileName)
        if (fs.statSync(filePath).isDirectory()) continue
        const fileContents = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContents)

        const slug = data.slug || fileName.replace(/\.mdx?$/, '')
        if (excludedSlugs.includes(slug)) continue

        const parentSlug = data.parentSlug
        const fullPath = parentSlug ? `/${parentSlug}/${slug}` : `/${slug}`

        sitemapUrls.push({
          url: `${BASE_URL}${fullPath}`,
          path: fullPath,
          type: 'page',
          slug,
        })
      }
    }

    const known = new Set(sitemapUrls.map((item) => item.path))
    for (const route of CODE_ROUTES) {
      if (known.has(route)) continue
      sitemapUrls.push({ url: `${BASE_URL}${route}`, path: route, type: 'route', slug: route.split('/').pop() || '' })
    }

    // Include blog posts
    localPosts.forEach((post) => {
      sitemapUrls.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        path: `/blog/${post.slug}`,
        type: 'post',
        slug: post.slug,
      })
    })

    return sitemapUrls
  } catch (error) {
    console.error('🚨 Error generating sitemap URLs:', error)
    return []
  }
}
