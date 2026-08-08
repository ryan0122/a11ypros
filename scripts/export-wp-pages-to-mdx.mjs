import fs from 'node:fs'
import path from 'node:path'
import TurndownService from 'turndown'
import matter from 'gray-matter'

const CMS_URL = 'https://cms.a11ypros.com'
const SITE_URL = 'https://a11ypros.com'

const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'pages')

// Initialize Turndown HTML to Markdown converter
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => `~~${content}~~`,
})

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

function extractMetaDescription(htmlString) {
  const regex = /<meta name="description" content="(.*?)"\s*\/?>/i
  const match = regex.exec(htmlString)
  return match ? match[1] : ''
}

function extractMetaTitle(htmlString) {
  const regex = /<title>(.*?)<\/title>/i
  const match = regex.exec(htmlString)
  return match ? match[1] : ''
}

async function exportPages() {
  console.log('🚀 Starting WordPress Pages to Local MDX Export...')

  if (!fs.existsSync(PAGES_DIR)) {
    fs.mkdirSync(PAGES_DIR, { recursive: true })
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  const res = await fetch(`${CMS_URL}/wp-json/wp/v2/pages?_embed=true&per_page=100`)
  if (!res.ok) {
    throw new Error(`Failed to fetch pages from WordPress API: ${res.statusText}`)
  }

  const pages = await res.json()
  console.log(`Fetched ${pages.length} pages from WordPress API. Processing...`)

  // Build ID to slug parent mapping
  const pageMap = new Map()
  pages.forEach((p) => pageMap.set(p.id, p))

  for (const page of pages) {
    const slug = page.slug
    const title = page.title?.rendered ? page.title.rendered.replace(/<[^>]*>/g, '') : ''
    const htmlBody = page.content?.rendered || ''

    // Determine parent slug if nested
    let parentSlug = null
    if (page.parent && pageMap.has(page.parent)) {
      parentSlug = pageMap.get(page.parent).slug
    }

    // Extract ACF FAQs if present
    let faqs = []
    if (Array.isArray(page.acf?.['faq-acf-repeater'])) {
      faqs = page.acf['faq-acf-repeater'].map((faq) => ({
        question: faq.faq_question,
        answer: faq.faq_answer,
      }))
    }

    // Download featured image if available
    let featuredImageObj = null
    const wpImageSrc = page._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const altText = page._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''
    if (wpImageSrc) {
      const ext = path.extname(new URL(wpImageSrc).pathname) || '.jpg'
      const filename = `${slug}${ext}`
      const targetPath = path.join(IMAGES_DIR, filename)
      console.log(`Downloading featured image for page "${slug}"...`)
      const success = await downloadImage(wpImageSrc, targetPath)
      if (success) {
        featuredImageObj = {
          source_url: `/images/pages/${filename}`,
          alt_text: altText,
        }
      }
    }

    // Fetch RankMath SEO Meta
    let rankMathSchema = ''
    let seoDescription = ''
    let seoTitle = title
    const fullPath = parentSlug ? `${parentSlug}/${slug}` : slug

    try {
      const rankMathRes = await fetch(`${CMS_URL}/wp-json/rankmath/v1/getHead?url=${SITE_URL}/${fullPath}`)
      if (rankMathRes.ok) {
        const rankMathData = await rankMathRes.json()
        const headHtml = rankMathData.head || ''

        const jsonLdMatch = headHtml.match(/<script type="application\/ld\+json" class="rank-math-schema-pro">([\s\S]*?)<\/script>/i)
          || headHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)
        if (jsonLdMatch) {
          rankMathSchema = jsonLdMatch[1].trim()
        }

        seoDescription = extractMetaDescription(headHtml)
        seoTitle = extractMetaTitle(headHtml) || title
      }
    } catch (err) {
      console.warn(`Could not fetch RankMath meta for page ${slug}:`, err.message)
    }

    const markdownContent = turndownService.turndown(htmlBody)

    const data = {
      title,
      slug,
      parentSlug,
      seoTitle,
      seoDescription,
      rankMathSchema,
      faqs,
      featuredImage: featuredImageObj,
    }

    const fileContent = matter.stringify(markdownContent, data)
    const filePath = path.join(PAGES_DIR, `${slug}.mdx`)
    fs.writeFileSync(filePath, fileContent, 'utf-8')
    console.log(`✅ Saved page: ${filePath}`)
  }

  console.log('\n🎉 Pages Export complete! All pages saved to src/content/pages/')
}

exportPages().catch((err) => {
  console.error('Export failed:', err)
  process.exit(1)
})
