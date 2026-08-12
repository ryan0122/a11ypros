import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages')

interface FAQItem {
  question: string
  answer: string
}

export interface PageData {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  parentSlug?: string | null
  featuredImage?: { source_url: string; alt_text?: string } | null
  faqs: FAQItem[]
}

function stringToNumericId(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Fetch Page data directly from local MDX files in src/content/pages/
 */
export async function getPageData(slug: string): Promise<PageData | null> {
  if (!fs.existsSync(PAGES_DIR)) {
    return null
  }

  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    return null
  }

  let filePath = path.join(PAGES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PAGES_DIR, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
      // Fallback: search files for matching frontmatter slug
      const fileNames = fs.readdirSync(PAGES_DIR)
      for (const fn of fileNames) {
        const fullPath = path.join(PAGES_DIR, fn)
        if (fs.statSync(fullPath).isDirectory()) continue
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const { data } = matter(fileContents)
        if (data.slug === slug) {
          filePath = fullPath
          break
        }
      }
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContents)

  // Convert markdown to HTML string (preserve raw HTML tags like grid cards)
  const processedContent = await remark().use(html, { sanitize: false }).process(content)
  const contentHtml = processedContent.toString()

  const id = stringToNumericId(slug)

  return {
    id,
    slug: data.slug || slug,
    title: { rendered: data.title || slug },
    content: { rendered: contentHtml },
    parentSlug: data.parentSlug || null,
    featuredImage: data.featuredImage || null,
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
  }
}

/**
 * Fetch SEO metadata directly from local MDX frontmatter
 */
export async function getPageMetaData(fullSlug: string) {
  // Extract child slug if path is parent/child
  const parts = fullSlug.split('/')
  const slug = parts[parts.length - 1]

  const page = await getPageData(slug)
  if (!page) return null

  // Re-read file frontmatter for RankMath fields
  let filePath = path.join(PAGES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PAGES_DIR, `${slug}.md`)
  }

  let rankMathSchema = ''
  let description = ''
  let rankMathMeta = ''

  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContents)
    description = data.seoDescription || ''
    rankMathSchema = data.rankMathSchema || ''
    rankMathMeta = data.seoTitle || data.title || ''
  }

  return {
    description,
    rankMathMeta,
    rankMathSchema,
  }
}