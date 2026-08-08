import fs from 'node:fs'
import path from 'node:path'
import TurndownService from 'turndown'
import matter from 'gray-matter'

const CMS_URL = 'https://cms.a11ypros.com'
const SITE_URL = 'https://a11ypros.com'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog')

// Initialize Turndown HTML to Markdown converter
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

// Custom turndown rules for clean markdown output
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~~${content}~~`,
})

/**
 * Download an image URL to a local destination file path
 */
async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(destPath, buffer)
    return true
  } catch (err) {
    console.error(`Failed to download image ${url}:`, err.message)
    return null
  }
}

/**
 * Extract meta description from RankMath head HTML string
 */
function extractMetaDescription(htmlString) {
  const regex = /<meta name="description" content="(.*?)"\s*\/?>/i
  const match = regex.exec(htmlString)
  return match ? match[1] : ''
}

/**
 * Extract meta title from RankMath head HTML string
 */
function extractMetaTitle(htmlString) {
  const regex = /<title>(.*?)<\/title>/i
  const match = regex.exec(htmlString)
  return match ? match[1] : ''
}

async function exportPosts() {
  console.log('🚀 Starting WordPress to Local MDX Export...')

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true })
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  const res = await fetch(`${CMS_URL}/wp-json/wp/v2/posts?_embed=true&per_page=100`)
  if (!res.ok) {
    throw new Error(`Failed to fetch posts from WordPress API: ${res.statusText}`)
  }

  const posts = await res.json()
  console.log(`Fetched ${posts.length} posts from WordPress API. Processing...`)

  for (const post of posts) {
    const slug = post.slug
    const title = post.title?.rendered ? post.title.rendered.replace(/<[^>]*>/g, '') : ''
    const date = post.date || new Date().toISOString()
    const rawExcerpt = post.excerpt?.rendered ? post.excerpt.rendered.replace(/<[^>]*>/g, '').trim() : ''
    const authorName = post._embedded?.author?.[0]?.name || 'A11y Pros Editorial Team'
    const htmlBody = post.content?.rendered || ''

    // Download featured image if available
    let localImagePath = ''
    const wpImageSrc = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    if (wpImageSrc) {
      const ext = path.extname(new URL(wpImageSrc).pathname) || '.jpg'
      const filename = `${slug}${ext}`
      const targetPath = path.join(IMAGES_DIR, filename)
      console.log(`Downloading featured image for "${slug}"...`)
      const success = await downloadImage(wpImageSrc, targetPath)
      if (success) {
        localImagePath = `/images/blog/${filename}`
      }
    }

    // Fetch RankMath SEO Meta
    let rankMathSchema = ''
    let seoDescription = rawExcerpt
    let seoTitle = title

    try {
      const rankMathRes = await fetch(`${CMS_URL}/wp-json/rankmath/v1/getHead?url=${SITE_URL}/blog/${slug}`)
      if (rankMathRes.ok) {
        const rankMathData = await rankMathRes.json()
        const headHtml = rankMathData.head || ''

        // Extract JSON-LD schema block
        const jsonLdMatch = headHtml.match(/<script type="application\/ld\+json" class="rank-math-schema-pro">([\s\S]*?)<\/script>/i)
          || headHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)
        if (jsonLdMatch) {
          rankMathSchema = jsonLdMatch[1].trim()
        }

        const extractedDesc = extractMetaDescription(headHtml)
        if (extractedDesc) seoDescription = extractedDesc

        const extractedTitle = extractMetaTitle(headHtml)
        if (extractedTitle) seoTitle = extractedTitle
      }
    } catch (err) {
      console.warn(`Could not fetch RankMath meta for ${slug}:`, err.message)
    }

    // Convert HTML content to clean Markdown
    const markdownContent = turndownService.turndown(htmlBody)

    // Build frontmatter data
    const data = {
      title,
      slug,
      date,
      author_name: authorName,
      excerpt: rawExcerpt,
      featured_image_url: localImagePath,
      seoTitle,
      seoDescription,
      rankMathSchema,
    }

    const fileContent = matter.stringify(markdownContent, data)
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
    fs.writeFileSync(filePath, fileContent, 'utf-8')
    console.log(`✅ Saved post: ${filePath}`)
  }

  console.log('\n🎉 Export complete! All posts converted to local MDX files in src/content/posts/')
}

exportPosts().catch((err) => {
  console.error('Export failed:', err)
  process.exit(1)
})
