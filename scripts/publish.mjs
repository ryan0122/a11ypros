import fs from 'node:fs'
import path from 'node:path'
import { notifyGoogleIndexing } from './index-url.mjs'

const CMS_URL = "https://cms.a11ypros.com/wp-json/wp/v2"
const CMS_BASE_DOMAIN = "https://cms.a11ypros.com/wp-json"

// Read auth header from .env.local if present
let authHeader = "Basic YTExeXByb2NtczpOQlZPIHRkOFogSHlxTyBoVmYzIHVtVEEgZkhjUg=="
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8')
  const match = envContent.match(/NEXT_PUBLIC_WP_AUTH=["']?(.*?)["']?$/m)
  if (match && match[1]) {
    authHeader = match[1]
  }
} catch (e) {
  // Use fallback
}

/**
 * Upload an image file to WordPress Media Library
 */
export async function uploadMedia(filePath, altText = '') {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Media file not found at path: ${filePath}`)
  }

  const fileBuffer = fs.readFileSync(filePath)
  const filename = path.basename(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'

  console.log(`Uploading media "${filename}" to WordPress...`)

  const res = await fetch(`${CMS_URL}/media`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
    body: fileBuffer,
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Media Upload Error:', data)
    throw new Error(`WordPress Media API returned status ${res.status}: ${JSON.stringify(data)}`)
  }

  console.log(`Successfully uploaded media! Media ID: ${data.id}`)

  // Update alt text if provided
  if (altText && data.id) {
    await fetch(`${CMS_URL}/media/${data.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ alt_text: altText }),
    })
  }

  return data
}

/**
 * Update Rank Math SEO metadata for a post
 */
export async function updateRankMathMeta(postId, { seoDescription, seoTitle, focusKeyword }) {
  const metaObj = {}
  if (seoDescription) metaObj.rank_math_description = seoDescription
  if (seoTitle) metaObj.rank_math_title = seoTitle
  if (focusKeyword) metaObj.rank_math_focus_keyword = focusKeyword

  if (Object.keys(metaObj).length === 0) return

  console.log(`Updating Rank Math SEO metadata for Post #${postId}...`)

  try {
    // 1. Try standard WP post meta update
    const res = await fetch(`${CMS_URL}/posts/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ meta: metaObj }),
    })

    if (res.ok) {
      console.log(`[Rank Math Pro] Successfully updated Rank Math metadata via post meta!`)
      return
    }

    // 2. Fallback: Rank Math custom endpoint if present
    const rankMathRes = await fetch(`${CMS_BASE_DOMAIN}/rankmath/v1/updateMeta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        objectID: postId,
        objectType: 'post',
        meta: metaObj,
      }),
    })

    if (rankMathRes.ok) {
      console.log(`[Rank Math Pro] Successfully updated Rank Math metadata via Rank Math API!`)
    }
  } catch (err) {
    console.warn(`[Rank Math Pro Warning] Could not update Rank Math meta: ${err.message}`)
  }
}

/**
 * Publish an article with featured media, Rank Math SEO metadata, & Google Search Console indexing
 */
export async function publishArticle({
  title,
  content,
  excerpt,
  slug,
  status = 'publish',
  imagePath = null,
  altText = '',
  seoDescription = null,
  seoTitle = null,
  focusKeyword = null,
}) {
  let featured_media = undefined

  if (imagePath) {
    try {
      const mediaResult = await uploadMedia(imagePath, altText || title)
      featured_media = mediaResult.id
    } catch (err) {
      console.warn('Failed to upload featured media, proceeding without it:', err.message)
    }
  }

  console.log(`Publishing article "${title}" to ${CMS_URL}...`)

  const postPayload = {
    title,
    content,
    slug,
    excerpt: excerpt || seoDescription || '',
    status,
    featured_media,
    meta: {
      rank_math_description: seoDescription || excerpt || '',
      rank_math_title: seoTitle || title || '',
      rank_math_focus_keyword: focusKeyword || '',
    },
  }

  const res = await fetch(`${CMS_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(postPayload),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Publish Error:', data)
    throw new Error(`WordPress API returned status ${res.status}: ${JSON.stringify(data)}`)
  }

  const liveUrl = `https://a11ypros.com/blog/${data.slug}`
  console.log(`Successfully published post!`)
  console.log(`ID: ${data.id}`)
  console.log(`Slug: ${data.slug}`)
  console.log(`Link: ${liveUrl}`)

  // Update Rank Math SEO metadata explicitly
  const finalMetaDesc = seoDescription || excerpt
  if (finalMetaDesc || seoTitle || focusKeyword) {
    await updateRankMathMeta(data.id, {
      seoDescription: finalMetaDesc,
      seoTitle: seoTitle || title,
      focusKeyword,
    })
  }

  // Trigger automated Google Indexing API submission
  await notifyGoogleIndexing(liveUrl, 'URL_UPDATED')

  return data
}
