export interface NewPostPayload {
  title: string
  content: string
  slug?: string
  excerpt?: string
  status?: 'publish' | 'draft' | 'pending'
  categories?: number[]
  featured_media?: number
}

export interface PublishResult {
  id: number
  slug: string
  link: string
  title: { rendered: string }
  status: string
}

const CMS_BASE = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.a11ypros.com/wp-json/wp/v2'
const AUTH_HEADER = process.env.WP_AUTH || process.env.NEXT_PUBLIC_WP_AUTH || ''

/**
 * Publish a new blog post directly to WordPress Headless CMS
 */
export async function publishPostToWordPress(payload: NewPostPayload): Promise<PublishResult> {
  const url = `${CMS_BASE}/posts`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTH_HEADER,
    },
    body: JSON.stringify({
      title: payload.title,
      content: payload.content,
      slug: payload.slug,
      excerpt: payload.excerpt,
      status: payload.status || 'publish',
      categories: payload.categories,
      featured_media: payload.featured_media,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`WordPress publish failed (${res.status}): ${errorText}`)
  }

  return await res.json()
}
