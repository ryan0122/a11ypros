import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { notifyGoogleIndexing } from './index-url.mjs'

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog')

/**
 * Publish an article locally as a Markdown/MDX file and trigger Google Search Console indexing
 */
export async function publishArticle({
  title,
  content,
  excerpt = '',
  slug = null,
  status = 'publish',
  imagePath = null,
  altText = '',
  seoDescription = null,
  seoTitle = null,
  focusKeyword = null,
}) {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true })
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  // Generate slug if not provided
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  let featuredImageUrl = ''

  // Copy local image to public/images/blog if provided
  if (imagePath && fs.existsSync(imagePath)) {
    const ext = path.extname(imagePath) || '.jpg'
    const imageFilename = `${finalSlug}${ext}`
    const destImagePath = path.join(IMAGES_DIR, imageFilename)
    fs.copyFileSync(imagePath, destImagePath)
    featuredImageUrl = `/images/blog/${imageFilename}`
    console.log(`Copied image asset to: ${featuredImageUrl}`)
  }

  const dateStr = new Date().toISOString()

  const frontmatter = {
    title,
    slug: finalSlug,
    date: dateStr,
    author_name: 'A11y Pros Editorial Team',
    excerpt: excerpt || seoDescription || '',
    featured_image_url: featuredImageUrl,
    seoTitle: seoTitle || title,
    seoDescription: seoDescription || excerpt || '',
    focusKeyword: focusKeyword || '',
    status,
  }

  const fileContent = matter.stringify(content, frontmatter)
  const targetFilePath = path.join(POSTS_DIR, `${finalSlug}.mdx`)

  fs.writeFileSync(targetFilePath, fileContent, 'utf-8')

  const liveUrl = `https://a11ypros.com/blog/${finalSlug}`
  console.log(`\n✅ Article successfully saved locally to Git repository!`)
  console.log(`File: ${targetFilePath}`)
  console.log(`Live Route: ${liveUrl}`)

  // Trigger automated Google Indexing API submission
  await notifyGoogleIndexing(liveUrl, 'URL_UPDATED')

  return {
    slug: finalSlug,
    link: liveUrl,
    title,
    filePath: targetFilePath,
  }
}
