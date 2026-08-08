import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { getPosts } from '@/lib/api/posts/dataApi'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://a11ypros.com'
const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages')

export interface SitemapUrl {
  url: string
  path: string
  type: 'page' | 'post' | 'home'
  slug: string
}

export async function fetchWordPressPages(): Promise<SitemapUrl[]> {
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
