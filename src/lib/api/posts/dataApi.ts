import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import { sanitizeMdxContent } from '@/lib/utils/sanitizeHtml'

export interface Post {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  slug: string
  date: string
  author: number
  author_name?: string
  featured_media: number
  featured_image_url?: string
  content?: { rendered: string }
  rankMathMeta?: string
  schemaType?: string // schema.org Article subtype, e.g. TechArticle; defaults to BlogPosting
  seoDescription?: string
  faqs?: PostFAQ[]
  gatedDownload?: PostGatedDownload
}

export interface PostFAQ {
  question: string
  answer: string // sanitized HTML rendered from the frontmatter Markdown
}

export interface PostGatedDownload {
  title: string
  description: string
  fileUrl: string
  buttonText?: string
}

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')

/**
 * Generate a consistent numeric ID from a string slug
 */
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
 * Render a Markdown string to sanitized HTML (GFM enabled)
 */
async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown)
  return sanitizeMdxContent(processed.toString())
}

/**
 * Normalize the optional `faqs` frontmatter list. Answers may contain Markdown
 * (links, emphasis, lists) and are rendered to sanitized HTML.
 */
async function parseFaqs(raw: unknown): Promise<PostFAQ[]> {
  if (!Array.isArray(raw)) return []

  const items = raw.filter(
    (faq): faq is { question: string; answer: string } =>
      !!faq && typeof faq.question === 'string' && typeof faq.answer === 'string' && !!faq.question.trim() && !!faq.answer.trim()
  )

  return Promise.all(
    items.map(async (faq) => ({
      question: faq.question.trim(),
      answer: await markdownToHtml(faq.answer),
    }))
  )
}

/**
 * Normalize the optional `gatedDownload` frontmatter block.
 */
function parseGatedDownload(raw: unknown): PostGatedDownload | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const obj = raw as Record<string, unknown>
  if (
    typeof obj.title !== 'string' ||
    typeof obj.description !== 'string' ||
    typeof obj.fileUrl !== 'string' ||
    !obj.title.trim() ||
    !obj.fileUrl.trim()
  ) {
    return undefined
  }
  return {
    title: obj.title.trim(),
    description: obj.description.trim(),
    fileUrl: obj.fileUrl.trim(),
    buttonText: typeof obj.buttonText === 'string' && obj.buttonText.trim() ? obj.buttonText.trim() : undefined,
  }
}

/**
 * Read and parse all local MDX post files from disk
 */
function parseAllLocalPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn(`[MDX Data API Warning] Posts directory not found: ${POSTS_DIR}`)
    return []
  }

  const fileNames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
  console.log(`📂 [MDX Data API] Loaded ${fileNames.length} posts directly from local Git files (${POSTS_DIR})`)

  const posts: Post[] = fileNames.map((fileName) => {
    const filePath = path.join(POSTS_DIR, fileName)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContents)

    const slug = data.slug || fileName.replace(/\.mdx?$/, '')
    const id = stringToNumericId(slug)

    return {
      id,
      title: { rendered: data.title || '' },
      excerpt: { rendered: data.excerpt || data.seoDescription || '' },
      slug,
      date: data.date || new Date().toISOString(),
      author: 1,
      author_name: data.author_name || 'A11y Pros Editorial Team',
      featured_media: 1,
      featured_image_url: data.featured_image_url || undefined,
      seoDescription: data.seoDescription || data.excerpt || '',
      schemaType: data.schemaType || undefined,
      rankMathMeta: data.seoTitle || data.title || '',
    }
  })

  // Sort posts by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Fetch all posts for listing pages (fast local disk read)
 */
export async function getPostsForListing(): Promise<Post[]> {
  return parseAllLocalPosts()
}

/**
 * Fetch all blog posts with metadata (used for sitemap, etc.)
 */
export async function getPosts(): Promise<Post[]> {
  return parseAllLocalPosts()
}

/**
 * Fetch a single blog post by slug with rendered HTML content
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!fs.existsSync(POSTS_DIR)) {
    return null
  }

  // Try slug.mdx or slug.md
  let filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(POSTS_DIR, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
      // Fallback: search by frontmatter slug
      const fileNames = fs.readdirSync(POSTS_DIR)
      for (const fn of fileNames) {
        const fullPath = path.join(POSTS_DIR, fn)
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

  // Process markdown body to HTML string (with GFM tables/autolinks) and apply strict HTML sanitization
  const contentHtml = await markdownToHtml(content)
  const faqs = await parseFaqs(data.faqs)
  const gatedDownload = parseGatedDownload(data.gatedDownload)

  const id = stringToNumericId(slug)

  return {
    id,
    title: { rendered: data.title || '' },
    excerpt: { rendered: data.excerpt || data.seoDescription || '' },
    slug,
    date: data.date || new Date().toISOString(),
    author: 1,
    author_name: data.author_name || 'A11y Pros Editorial Team',
    featured_media: 1,
    featured_image_url: data.featured_image_url || undefined,
    content: { rendered: contentHtml },
    seoDescription: data.seoDescription || data.excerpt || '',
    schemaType: data.schemaType || undefined,
    rankMathMeta: data.seoTitle || data.title || '',
    faqs,
    gatedDownload,
  }
}
